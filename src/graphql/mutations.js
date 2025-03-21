/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      name
      age
      bio
      imageUrl
      gender
      lookingFor
      location
      interests
      lastActive
      createdAt
      updatedAt
      sentLikes {
        nextToken
        __typename
      }
      receivedLikes {
        nextToken
        __typename
      }
      sentMessages {
        nextToken
        __typename
      }
      receivedMessages {
        nextToken
        __typename
      }
      conversations {
        nextToken
        __typename
      }
      owner
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      name
      age
      bio
      imageUrl
      gender
      lookingFor
      location
      interests
      lastActive
      createdAt
      updatedAt
      sentLikes {
        nextToken
        __typename
      }
      receivedLikes {
        nextToken
        __typename
      }
      sentMessages {
        nextToken
        __typename
      }
      receivedMessages {
        nextToken
        __typename
      }
      conversations {
        nextToken
        __typename
      }
      owner
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      name
      age
      bio
      imageUrl
      gender
      lookingFor
      location
      interests
      lastActive
      createdAt
      updatedAt
      sentLikes {
        nextToken
        __typename
      }
      receivedLikes {
        nextToken
        __typename
      }
      sentMessages {
        nextToken
        __typename
      }
      receivedMessages {
        nextToken
        __typename
      }
      conversations {
        nextToken
        __typename
      }
      owner
      __typename
    }
  }
`;
export const createMatch = /* GraphQL */ `
  mutation CreateMatch(
    $input: CreateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    createMatch(input: $input, condition: $condition) {
      id
      likerId
      likeeId
      liker {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      likee {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      matched
      matchedDate
      conversationId
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        matchId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateMatch = /* GraphQL */ `
  mutation UpdateMatch(
    $input: UpdateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    updateMatch(input: $input, condition: $condition) {
      id
      likerId
      likeeId
      liker {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      likee {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      matched
      matchedDate
      conversationId
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        matchId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteMatch = /* GraphQL */ `
  mutation DeleteMatch(
    $input: DeleteMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    deleteMatch(input: $input, condition: $condition) {
      id
      likerId
      likeeId
      liker {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      likee {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      matched
      matchedDate
      conversationId
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        matchId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createConversation = /* GraphQL */ `
  mutation CreateConversation(
    $input: CreateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    createConversation(input: $input, condition: $condition) {
      id
      name
      participants {
        nextToken
        __typename
      }
      lastMessageText
      lastMessageSentAt
      lastMessageSenderId
      messages {
        nextToken
        __typename
      }
      matchId
      match {
        id
        likerId
        likeeId
        matched
        matchedDate
        conversationId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateConversation = /* GraphQL */ `
  mutation UpdateConversation(
    $input: UpdateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    updateConversation(input: $input, condition: $condition) {
      id
      name
      participants {
        nextToken
        __typename
      }
      lastMessageText
      lastMessageSentAt
      lastMessageSenderId
      messages {
        nextToken
        __typename
      }
      matchId
      match {
        id
        likerId
        likeeId
        matched
        matchedDate
        conversationId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteConversation = /* GraphQL */ `
  mutation DeleteConversation(
    $input: DeleteConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    deleteConversation(input: $input, condition: $condition) {
      id
      name
      participants {
        nextToken
        __typename
      }
      lastMessageText
      lastMessageSentAt
      lastMessageSenderId
      messages {
        nextToken
        __typename
      }
      matchId
      match {
        id
        likerId
        likeeId
        matched
        matchedDate
        conversationId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      text
      senderId
      receiverId
      conversationId
      sender {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      receiver {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        matchId
        createdAt
        updatedAt
        owner
        __typename
      }
      read
      readAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      text
      senderId
      receiverId
      conversationId
      sender {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      receiver {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        matchId
        createdAt
        updatedAt
        owner
        __typename
      }
      read
      readAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      text
      senderId
      receiverId
      conversationId
      sender {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      receiver {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        matchId
        createdAt
        updatedAt
        owner
        __typename
      }
      read
      readAt
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const createUserConversations = /* GraphQL */ `
  mutation CreateUserConversations(
    $input: CreateUserConversationsInput!
    $condition: ModelUserConversationsConditionInput
  ) {
    createUserConversations(input: $input, condition: $condition) {
      id
      userId
      conversationId
      user {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        matchId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updateUserConversations = /* GraphQL */ `
  mutation UpdateUserConversations(
    $input: UpdateUserConversationsInput!
    $condition: ModelUserConversationsConditionInput
  ) {
    updateUserConversations(input: $input, condition: $condition) {
      id
      userId
      conversationId
      user {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        matchId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deleteUserConversations = /* GraphQL */ `
  mutation DeleteUserConversations(
    $input: DeleteUserConversationsInput!
    $condition: ModelUserConversationsConditionInput
  ) {
    deleteUserConversations(input: $input, condition: $condition) {
      id
      userId
      conversationId
      user {
        id
        name
        age
        bio
        imageUrl
        gender
        lookingFor
        location
        interests
        lastActive
        createdAt
        updatedAt
        owner
        __typename
      }
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        matchId
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
