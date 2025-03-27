interface ApiConfig {
  baseUrl: string;
  endpoints: {
    ocr: string;
  };
}

const development: ApiConfig = {
  baseUrl: 'http://localhost:5000',
  endpoints: {
    ocr: '/ocr',
  },
};

const production: ApiConfig = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  endpoints: {
    ocr: '/ocr',
  },
};

const config = process.env.NODE_ENV === 'production' ? production : development;

export default config;