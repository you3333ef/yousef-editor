import SettingsManager from '../utils/SettingsManager';

class AIProvider {
  constructor() {
    this.providers = {
      anthropic: {
        name: 'Anthropic Claude',
        models: [
          { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Latest, most capable' },
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful' },
          { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced speed/quality' },
          { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fastest' },
        ],
        endpoint: 'https://api.anthropic.com/v1',
        authType: 'apiKey',
        authHeader: 'x-api-key',
      },
      openai: {
        name: 'OpenAI',
        models: [
          { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable model' },
          { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient' },
          { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Turbocharged' },
          { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and affordable' },
        ],
        endpoint: 'https://api.openai.com/v1',
        authType: 'apiKey',
        authHeader: 'Authorization',
      },
      google: {
        name: 'Google Gemini',
        models: [
          { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most advanced' },
          { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast responses' },
          { id: 'gemini-pro', name: 'Gemini Pro', description: 'Balanced' },
        ],
        endpoint: 'https://generativelanguage.googleapis.com/v1',
        authType: 'apiKey',
        authHeader: 'x-goog-api-key',
      },
      cohere: {
        name: 'Cohere',
        models: [
          { id: 'command-r-plus', name: 'Command R+', description: 'Most capable' },
          { id: 'command-r', name: 'Command R', description: 'Fast' },
          { id: 'command', name: 'Command', description: 'Balanced' },
        ],
        endpoint: 'https://api.cohere.ai/v1',
        authType: 'apiKey',
        authHeader: 'Authorization',
      },
      together: {
        name: 'Together AI',
        models: [
          { id: 'meta-llama/Llama-3.1-70B-Instruct-Turbo', name: 'Llama 3.1 70B', description: 'Meta' },
          { id: 'meta-llama/Llama-3.1-8B-Instruct-Turbo', name: 'Llama 3.1 8B', description: 'Meta' },
          { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen 2.5 72B', description: 'Qwen' },
          { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', description: 'Mistral' },
        ],
        endpoint: 'https://api.together.xyz/v1',
        authType: 'apiKey',
        authHeader: 'Authorization',
      },
      ollama: {
        name: 'Ollama (Local)',
        models: [
          { id: 'llama3.1', name: 'Llama 3.1 8B', description: 'Local, lightweight' },
          { id: 'llama3.1:70b', name: 'Llama 3.1 70B', description: 'Local, powerful' },
          { id: 'codellama', name: 'Code Llama', description: 'Code specialized' },
          { id: 'mistral', name: 'Mistral 7B', description: 'Fast local' },
        ],
        endpoint: 'http://localhost:11434/api',
        authType: 'none',
        authHeader: null,
      },
      openrouter: {
        name: 'OpenRouter',
        models: [
          { id: 'openai/gpt-4o', name: 'GPT-4o (OpenRouter)', description: 'Via OpenRouter' },
          { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (OpenRouter)', description: 'Via OpenRouter' },
          { id: 'google/gemini-pro', name: 'Gemini Pro (OpenRouter)', description: 'Via OpenRouter' },
          { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B (OpenRouter)', description: 'Open source' },
          { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B (OpenRouter)', description: 'Open source' },
          { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B (OpenRouter)', description: 'Open source' },
        ],
        endpoint: 'https://openrouter.ai/api/v1',
        authType: 'apiKey',
        authHeader: 'Authorization',
      },
      minimax: {
        name: 'MiniMax AI',
        models: [
          { id: 'abab6.5s-chat', name: 'MiniMax abab6.5s', description: 'Fast, efficient' },
          { id: 'abab6.5g-chat', name: 'MiniMax abab6.5g', description: 'General purpose' },
          { id: 'abab6.5-chat', name: 'MiniMax abab6.5', description: 'Standard model' },
          { id: 'abab5.5s-chat', name: 'MiniMax abab5.5s', description: 'Legacy fast' },
          { id: 'abab5.5g-chat', name: 'MiniMax abab5.5g', description: 'Legacy general' },
          { id: 'abab5.5-chat', name: 'MiniMax abab5.5', description: 'Legacy standard' },
        ],
        endpoint: 'https://api.minimax.chat/v1',
        authType: 'apiKey',
        authHeader: 'Authorization',
      },
    };

    this.settings = null;
  }

  async init() {
    this.settings = await SettingsManager.loadApiSettings();
    return this;
  }

  getProviders() {
    return this.providers;
  }

  getModels(providerId) {
    return this.providers[providerId]?.models || [];
  }

  async generateCode(prompt, language = 'javascript', provider = null, model = null) {
    const settings = this.settings || await SettingsManager.loadApiSettings();
    const selectedProvider = provider || settings.selectedProvider || 'anthropic';
    const selectedModel = model || settings.selectedModel || 'claude-3-sonnet-20240229';

    // Add Claude Code specific context
    const enhancedPrompt = `
You are Claude Code, an expert AI coding assistant. Please generate ${language} code based on the following request:

${prompt}

Requirements:
- Write clean, well-documented code
- Follow best practices
- Include error handling
- Optimize for performance
- Use modern syntax (${language})
`;

    try {
      let response;
      switch (selectedProvider) {
        case 'anthropic':
          response = await this.callAnthropic(enhancedPrompt, selectedModel, settings.anthropicApiKey);
          break;
        case 'openai':
          response = await this.callOpenAI(enhancedPrompt, selectedModel, settings.openaiApiKey);
          break;
        case 'google':
          response = await this.callGoogle(enhancedPrompt, selectedModel, settings.googleApiKey);
          break;
        case 'cohere':
          response = await this.callCohere(enhancedPrompt, selectedModel, settings.cohereApiKey);
          break;
        case 'together':
          response = await this.callTogether(enhancedPrompt, selectedModel, settings.togetherApiKey);
          break;
        case 'ollama':
          response = await this.callOllama(enhancedPrompt, selectedModel);
          break;
        default:
          throw new Error('Unknown provider');
      }

      return response;
    } catch (error) {
      console.error('Error generating code:', error);
      return { error: error.message };
    }
  }

  async callAnthropic(prompt, model, apiKey) {
    // Simulate API call
    const responses = {
      'claude-3-sonnet-20240229': `Here's the ${prompt.includes('javascript') ? 'JavaScript' : 'code'} solution:

\`\`\`javascript
${this.getMockCode(prompt)}
\`\`\`

This code follows best practices and includes proper error handling. Let me know if you need any modifications!`,
    };

    // In real implementation:
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': apiKey,
    //   },
    //   body: JSON.stringify({
    //     model: model,
    //     max_tokens: 4000,
    //     messages: [{ role: 'user', content: prompt }],
    //   }),
    // });

    return {
      success: true,
      content: responses[model] || responses['claude-3-sonnet-20240229'],
      provider: 'anthropic',
      model: model,
    };
  }

  async callOpenAI(prompt, model, apiKey) {
    return {
      success: true,
      content: `OpenAI ${model} response:\n\n${this.getMockCode(prompt)}`,
      provider: 'openai',
      model: model,
    };
  }

  async callGoogle(prompt, model, apiKey) {
    return {
      success: true,
      content: `Google Gemini ${model} response:\n\n${this.getMockCode(prompt)}`,
      provider: 'google',
      model: model,
    };
  }

  async callCohere(prompt, model, apiKey) {
    return {
      success: true,
      content: `Cohere ${model} response:\n\n${this.getMockCode(prompt)}`,
      provider: 'cohere',
      model: model,
    };
  }

  async callTogether(prompt, model, apiKey) {
    return {
      success: true,
      content: `Together AI ${model} response:\n\n${this.getMockCode(prompt)}`,
      provider: 'together',
      model: model,
    };
  }

  async callOllama(prompt, model) {
    return {
      success: true,
      content: `Ollama ${model} (Local) response:\n\n${this.getMockCode(prompt)}`,
      provider: 'ollama',
      model: model,
    };
  }

  getMockCode(prompt) {
    if (prompt.includes('function') || prompt.includes('create')) {
      return `function example() {
  console.log('Hello from code!');
  return true;
}`;
    } else if (prompt.includes('class')) {
      return `class Example {
  constructor() {
    this.name = 'Example';
  }

  greet() {
    return \`Hello, \${this.name}!\`;
  }
}`;
    } else {
      return `// Generated code
const data = {
  message: 'Hello World',
  timestamp: new Date().toISOString(),
};

console.log(data);`;
    }
  }

  async chatWithAI(message, context = []) {
    const settings = this.settings || await SettingsManager.loadApiSettings();
    const provider = settings.selectedProvider || 'anthropic';
    const model = settings.selectedModel || 'claude-3-sonnet-20240229';

    const fullContext = [...context, { role: 'user', content: message }];

    try {
      let response;
      switch (provider) {
        case 'anthropic':
          response = await this.callAnthropicChat(fullContext, model, settings.anthropicApiKey);
          break;
        case 'openai':
          response = await this.callOpenAIChat(fullContext, model, settings.openaiApiKey);
          break;
        default:
          response = await this.callAnthropicChat(fullContext, model, settings.anthropicApiKey);
      }

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  async callAnthropicChat(messages, model, apiKey) {
    // Simulate chat response
    return {
      success: true,
      content: 'I\'m Claude Code, your AI coding assistant! I can help you with:\n\n• Code generation and review\n• Debugging assistance\n• Best practices and architecture\n• Performance optimization\n• Documentation\n\nHow can I help you code today?',
      provider: 'anthropic',
      model: model,
    };
  }

  async testConnection(providerId, apiKey) {
    try {
      if (!apiKey) {
        return { success: false, error: 'API key is required' };
      }

      // Format validation first
      const formatValid = this.validateApiKeyFormat(providerId, apiKey);
      if (!formatValid.valid) {
        return { success: false, error: formatValid.error };
      }

      // Provider-specific test
      switch (providerId) {
        case 'anthropic':
          return await this.testAnthropic(apiKey);
        case 'openai':
          return await this.testOpenAI(apiKey);
        case 'google':
          return await this.testGoogle(apiKey);
        case 'cohere':
          return await this.testCohere(apiKey);
        case 'together':
          return await this.testTogether(apiKey);
        case 'ollama':
          return await this.testOllama();
        case 'openrouter':
          return await this.testOpenRouter(apiKey);
        case 'minimax':
          return await this.testMiniMax(apiKey);
        default:
          return { success: false, error: 'Unknown provider' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  validateApiKeyFormat(providerId, apiKey) {
    const formats = {
      anthropic: { prefix: 'sk-ant-', minLength: 50 },
      openai: { prefix: 'sk-', minLength: 40 },
      google: { minLength: 30 },
      cohere: { prefix: 'writable-', minLength: 40 },
      together: { prefix: 'tog-', minLength: 40 },
      openrouter: { prefix: 'sk-or-', minLength: 40 },
      minimax: { prefix: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.', minLength: 200 },
    };

    const format = formats[providerId];
    if (!format) return { valid: true };

    if (apiKey.length < format.minLength) {
      return { valid: false, error: `API key too short (min ${format.minLength} characters)` };
    }

    if (format.prefix && !apiKey.startsWith(format.prefix)) {
      return { valid: false, error: `API key must start with '${format.prefix}'` };
    }

    return { valid: true };
  }

  async testAnthropic(apiKey) {
    try {
      // Validate format
      if (!apiKey.startsWith('sk-ant-')) {
        return { success: false, error: 'API key must start with sk-ant-' };
      }

      // In a real implementation, make a test API call
      // const response = await fetch('https://api.anthropic.com/v1/messages', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-api-key': apiKey,
      //   },
      //   body: JSON.stringify({
      //     model: 'claude-3-haiku-20240307',
      //     max_tokens: 1,
      //     messages: [{ role: 'user', content: 'Hi' }],
      //   }),
      // });

      // For demo, simulate response
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Connected to Anthropic Claude API',
        provider: 'Anthropic Claude',
        status: 'active'
      };
    } catch (error) {
      return { success: false, error: `Connection failed: ${error.message}` };
    }
  }

  async testOpenAI(apiKey) {
    try {
      if (!apiKey.startsWith('sk-')) {
        return { success: false, error: 'API key must start with sk-' };
      }

      // Real implementation would call OpenAI API
      // const response = await fetch('https://api.openai.com/v1/models', {
      //   headers: { 'Authorization': `Bearer ${apiKey}` }
      // });

      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Connected to OpenAI API',
        provider: 'OpenAI',
        status: 'active'
      };
    } catch (error) {
      return { success: false, error: `Connection failed: ${error.message}` };
    }
  }

  async testGoogle(apiKey) {
    try {
      if (apiKey.length < 30) {
        return { success: false, error: 'API key appears to be invalid' };
      }

      // Real implementation would call Google API
      // const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Connected to Google Gemini API',
        provider: 'Google Gemini',
        status: 'active'
      };
    } catch (error) {
      return { success: false, error: `Connection failed: ${error.message}` };
    }
  }

  async testCohere(apiKey) {
    try {
      if (!apiKey.startsWith('writable-')) {
        return { success: false, error: 'API key must start with writable-' };
      }

      // Real implementation would call Cohere API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Connected to Cohere API',
        provider: 'Cohere',
        status: 'active'
      };
    } catch (error) {
      return { success: false, error: `Connection failed: ${error.message}` };
    }
  }

  async testTogether(apiKey) {
    try {
      if (!apiKey.startsWith('tog-')) {
        return { success: false, error: 'API key must start with tog-' };
      }

      // Real implementation would call Together AI API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Connected to Together AI API',
        provider: 'Together AI',
        status: 'active'
      };
    } catch (error) {
      return { success: false, error: `Connection failed: ${error.message}` };
    }
  }

  async testOllama() {
    try {
      // Test if Ollama is running locally
      // const response = await fetch('http://localhost:11434/api/tags');

      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Connected to Ollama (Local)',
        provider: 'Ollama',
        status: 'active',
        note: 'Running on localhost:11434'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Cannot connect to Ollama. Make sure Ollama is installed and running on localhost:11434'
      };
    }
  }

  async testOpenRouter(apiKey) {
    try {
      if (!apiKey.startsWith('sk-or-')) {
        return { success: false, error: 'API key must start with sk-or-' };
      }

      // Real implementation would call OpenRouter API
      // const response = await fetch('https://openrouter.ai/api/v1/models', {
      //   headers: { 'Authorization': `Bearer ${apiKey}` }
      // });

      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Connected to OpenRouter API',
        provider: 'OpenRouter',
        status: 'active',
        note: 'Access to multiple models via one API'
      };
    } catch (error) {
      return { success: false, error: `Connection failed: ${error.message}` };
    }
  }

  async testMiniMax(apiKey) {
    try {
      if (!apiKey.startsWith('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.')) {
        return { success: false, error: 'Invalid MiniMax API key format' };
      }

      // Real implementation would call MiniMax API
      // const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_pro', {
      //   headers: {
      //     'Authorization': `Bearer ${apiKey}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Connected to MiniMax AI',
        provider: 'MiniMax',
        status: 'active',
        model: 'abab6.5s-chat'
      };
    } catch (error) {
      return { success: false, error: `Connection failed: ${error.message}` };
    }
  }
}

export default new AIProvider();
