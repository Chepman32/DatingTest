// Enum definition for Gender
const Gender = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    NON_BINARY: 'NON_BINARY',
    OTHER: 'OTHER',
  };
  
  // User model
  const User = {
    name: 'User',
    fields: {
      id: 'ID!',
      name: 'String!',
      age: 'Int!',
      bio: 'String',
      imageUrl: 'String!',
      gender: 'Gender',
      lookingFor: '[Gender]',
      location: 'String',
      interests: '[String]',
      lastActive: 'AWSDateTime',
      createdAt: 'AWSDateTime',
      updatedAt: 'AWSDateTime',
      sentLikes: '[Match]', // @hasMany(indexName: "byLiker", fields: ["id"])
      receivedLikes: '[Match]', // @hasMany(indexName: "byLikee", fields: ["id"])
      sentMessages: '[Message]', // @hasMany(indexName: "bySender", fields: ["id"])
      receivedMessages: '[Message]', // @hasMany(indexName: "byReceiver", fields: ["id"])
      conversations: '[Conversation]', // @manyToMany(relationName: "UserConversations")
    },
  };
  
  // Match model
  const Match = {
    name: 'Match',
    fields: {
      id: 'ID!',
      likerId: 'ID!', // @index(name: "byLiker")
      likeeId: 'ID!', // @index(name: "byLikee")
      liker: 'User!', // @belongsTo(fields: ["likerId"])
      likee: 'User!', // @belongsTo(fields: ["likeeId"])
      matched: 'Boolean',
      matchedDate: 'AWSDateTime',
      conversationId: 'ID',
      conversation: 'Conversation', // @belongsTo(fields: ["conversationId"])
      createdAt: 'AWSDateTime',
      updatedAt: 'AWSDateTime',
    },
  };
  
  // Conversation model
  const Conversation = {
    name: 'Conversation',
    fields: {
      id: 'ID!',
      name: 'String',
      participants: '[User]', // @manyToMany(relationName: "UserConversations")
      lastMessageText: 'String',
      lastMessageSentAt: 'AWSDateTime',
      lastMessageSenderId: 'ID',
      messages: '[Message]', // @hasMany(indexName: "byConversation", fields: ["id"])
      matchId: 'ID',
      match: 'Match', // @hasOne(fields: ["matchId"])
      createdAt: 'AWSDateTime',
      updatedAt: 'AWSDateTime',
    },
  };
  
  // Message model
  const Message = {
    name: 'Message',
    fields: {
      id: 'ID!',
      text: 'String!',
      senderId: 'ID!', // @index(name: "bySender")
      receiverId: 'ID!', // @index(name: "byReceiver")
      conversationId: 'ID!', // @index(name: "byConversation")
      sender: 'User!', // @belongsTo(fields: ["senderId"])
      receiver: 'User!', // @belongsTo(fields: ["receiverId"])
      conversation: 'Conversation!', // @belongsTo(fields: ["conversationId"])
      read: 'Boolean!',
      readAt: 'AWSDateTime',
      createdAt: 'AWSDateTime!',
      updatedAt: 'AWSDateTime!',
    },
  };
  
  // Export all models
  export { User, Match, Conversation, Message, Gender };