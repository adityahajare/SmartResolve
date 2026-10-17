const axios = require('axios');
const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const aiService = {
  async analyzeTicket(payload) {
    const { data } = await axios.post(`${AI_URL}/analyze`, payload);
    return data;
  },
  async getSentiment(text) {
    const { data } = await axios.post(`${AI_URL}/sentiment`, { text });
    return data;
  },
  async classify(text) {
    const { data } = await axios.post(`${AI_URL}/classify`, { text });
    return data;
  },
  async getKBSuggestions(text, category) {
    const { data } = await axios.post(`${AI_URL}/kb/suggest`, { text, category });
    return data;
  },
  async getFrustrationForecast(payload) {
    const { data } = await axios.post(`${AI_URL}/forecast/frustration`, payload);
    return data;
  },
  async getResolutionConfidence(resolutionText, ticketContext) {
    const { data } = await axios.post(`${AI_URL}/resolution/confidence`, { resolutionText, ticketContext });
    return data;
  },
  async extractOCR(imageUrl) {
    const { data } = await axios.post(`${AI_URL}/ocr`, { imageUrl });
    return data;
  },
  async transcribeAudio(audioUrl) {
    const { data } = await axios.post(`${AI_URL}/stt`, { audioUrl });
    return data;
  },
  async matchDNA(dnaPattern, companyId) {
    const { data } = await axios.post(`${AI_URL}/dna/match`, { dnaPattern, companyId });
    return data;
  }
};

module.exports = aiService;
