import re
from datetime import datetime

# Indian currency & amounts
AMOUNT_RE   = re.compile(r'(?:rs\.?|₹|inr)\s*(\d[\d,]*)', re.IGNORECASE)
TXN_RE      = re.compile(r'\b(?:txn|transaction|ref|order)[^\w]*([A-Z0-9]{6,})\b', re.IGNORECASE)
DATE_RE     = re.compile(r'\b(\d{1,2}[\-/]\d{1,2}[\-/]\d{2,4}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{0,4})\b', re.IGNORECASE)
UPI_RE      = re.compile(r'[\w.\-]+@[\w.]+')
PHONE_RE    = re.compile(r'\b[6-9]\d{9}\b')
EMAIL_RE    = re.compile(r'\b[\w.+-]+@[\w-]+\.[a-z]{2,}\b', re.IGNORECASE)

def extract_entities(text: str) -> dict:
    amounts      = AMOUNT_RE.findall(text)
    transactions = TXN_RE.findall(text)
    dates        = DATE_RE.findall(text)
    upi_ids      = UPI_RE.findall(text)
    phones       = PHONE_RE.findall(text)

    # Clean amount
    amount = None
    if amounts:
        clean = amounts[0].replace(',', '')
        try: amount = float(clean)
        except: pass

    # Payment method detection
    payment_method = None
    text_lower = text.lower()
    if 'upi' in text_lower or '@' in text_lower:           payment_method = 'UPI'
    elif 'credit card' in text_lower or 'cc' in text_lower: payment_method = 'Credit Card'
    elif 'debit card' in text_lower:                         payment_method = 'Debit Card'
    elif 'net banking' in text_lower or 'netbanking' in text_lower: payment_method = 'Net Banking'
    elif 'wallet' in text_lower or 'paytm' in text_lower:   payment_method = 'Wallet'

    return {
        "amount":        amount,
        "currency":      "INR" if amount else None,
        "transactionId": transactions[0] if transactions else None,
        "date":          dates[0] if dates else None,
        "paymentMethod": payment_method,
        "upiId":         upi_ids[0] if upi_ids else None,
        "phone":         phones[0] if phones else None,
    }
