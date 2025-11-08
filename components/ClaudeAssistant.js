import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform} from 'react-native';

const ClaudeAssistant = () => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'claude', text: 'Hello! I\'m Claude, your AI coding assistant. I can help you with:\n\n• Code generation and review\n• Debugging assistance\n• Best practices\n• Architecture advice\n• Documentation\n\nHow can I help you today?', time: '10:30 AM' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(''); // In real app, load from secure storage
  const [selectedModel, setSelectedModel] = useState('claude-3-sonnet-20240229');
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    flatListRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate API call to Claude
    setTimeout(() => {
      const responses = [
        `I can help you with that code. Here's a suggestion:\n\n\`\`\`javascript\n// Your code here\nfunction yourFunction() {\n  console.log('Hello World');\n}\n\`\`\`\n\nWould you like me to explain this further?`,
        `That's a great question! Here are some best practices:\n\n1. Use meaningful variable names\n2. Add comments for complex logic\n3. Follow consistent formatting\n4. Test your code regularly\n\nWhat specific aspect would you like to explore?`,
        `I see you're working on a React Native project. Consider these tips:\n\n• Use functional components with hooks\n• Implement proper state management\n• Optimize for performance\n• Use TypeScript for better type safety\n\nDo you need help with a specific component?`,
        `For this error, try these solutions:\n\n1. Check your API endpoints\n2. Verify network permissions\n3. Review your error handling\n4. Add console.log for debugging\n\nWhich approach would you like to try first?`,
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const claudeMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'claude',
        text: randomResponse,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      };

      setMessages(prev => [...prev, claudeMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = ({nativeEvent}) => {
    if (nativeEvent.key === 'Enter' && !nativeEvent.shiftKey) {
      sendMessage();
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear the conversation?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([
              { id: '1', sender: 'claude', text: 'Hello! I\'m Claude, your AI coding assistant. How can I help you?', time: '10:30 AM' }
            ]);
          }
        }
      ]
    );
  };

  const quickPrompts = [
    'Help me debug this code',
    'Review my React component',
    'Explain this algorithm',
    'Suggest improvements',
    'Generate a function',
    'Help with Android permissions',
  ];

  const renderMessage = ({item}) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.claudeMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.claudeBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.claudeText
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>🤖 Claude Assistant</Text>
          <Text style={styles.headerStatus}>
            {isTyping ? 'Typing...' : 'Online'}
          </Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
          <Text style={styles.clearButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Prompts */}
      <View style={styles.quickPrompts}>
        <Text style={styles.quickPromptsTitle}>Quick prompts:</Text>
        <FlatList
          data={quickPrompts}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.quickPrompt}
              onPress={() => setInputText(item)}>
              <Text style={styles.quickPromptText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>Claude is typing...</Text>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          placeholder="Ask Claude anything about coding..."
          placeholderTextColor="#666"
          multiline
          maxLength={2000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim()}>
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2d2d30',
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerStatus: {
    color: '#4CAF50',
    fontSize: 12,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 18,
  },
  quickPrompts: {
    backgroundColor: '#252526',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3e3e42',
  },
  quickPromptsTitle: {
    color: '#999999',
    fontSize: 11,
    marginBottom: 6,
  },
  quickPrompt: {
    backgroundColor: '#3e3e42',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
  },
  quickPromptText: {
    color: '#cccccc',
    fontSize: 12,
  },
  messagesList: {
    flex: 1,
    padding: 12,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  claudeMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#0e639c',
  },
  claudeBubble: {
    backgroundColor: '#2d2d30',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  claudeText: {
    color: '#ffffff',
  },
  messageTime: {
    color: '#666666',
    fontSize: 10,
    marginTop: 4,
  },
  typingIndicator: {
    padding: 8,
    backgroundColor: '#252526',
  },
  typingText: {
    color: '#999999',
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#2d2d30',
    borderTopWidth: 1,
    borderTopColor: '#3e3e42',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#3c3c3c',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    maxHeight: 120,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#0e639c',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#3e3e42',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClaudeAssistant;
