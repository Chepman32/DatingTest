/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch(
    $filter: ModelSubscriptionMatchFilterInput
    $owner: String
  ) {
    onCreateMatch(filter: $filter, owner: $owner) {
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
export const onUpdateMatch = /* GraphQL */ `
  subscription OnUpdateMatch(
    $filter: ModelSubscriptionMatchFilterInput
    $owner: String
  ) {
    onUpdateMatch(filter: $filter, owner: $owner) {
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
export const onDeleteMatch = /* GraphQL */ `
  subscription OnDeleteMatch(
    $filter: ModelSubscriptionMatchFilterInput
    $owner: String
  ) {
    onDeleteMatch(filter: $filter, owner: $owner) {
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
export const onCreateConversation = /* GraphQL */ `
  subscription OnCreateConversation(
    $filter: ModelSubscriptionConversationFilterInput
    $owner: String
  ) {
    onCreateConversation(filter: $filter, owner: $owner) {
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
export const onUpdateConversation = /* GraphQL */ `
  subscription OnUpdateConversation(
    $filter: ModelSubscriptionConversationFilterInput
    $owner: String
  ) {
    onUpdateConversation(filter: $filter, owner: $owner) {
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
export const onDeleteConversation = /* GraphQL */ `
  subscription OnDeleteConversation(
    $filter: ModelSubscriptionConversationFilterInput
    $owner: String
  ) {
    onDeleteConversation(filter: $filter, owner: $owner) {
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
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $owner: String
  ) {
    onCreateMessage(filter: $filter, owner: $owner) {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $owner: String
  ) {
    onUpdateMessage(filter: $filter, owner: $owner) {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage(
    $filter: ModelSubscriptionMessageFilterInput
    $owner: String
  ) {
    onDeleteMessage(filter: $filter, owner: $owner) {
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
export const onCreateUserConversations = /* GraphQL */ `
  subscription OnCreateUserConversations(
    $filter: ModelSubscriptionUserConversationsFilterInput
    $owner: String
  ) {
    onCreateUserConversations(filter: $filter, owner: $owner) {
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
export const onUpdateUserConversations = /* GraphQL */ `
  subscription OnUpdateUserConversations(
    $filter: ModelSubscriptionUserConversationsFilterInput
    $owner: String
  ) {
    onUpdateUserConversations(filter: $filter, owner: $owner) {
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
export const onDeleteUserConversations = /* GraphQL */ `
  subscription OnDeleteUserConversations(
    $filter: ModelSubscriptionUserConversationsFilterInput
    $owner: String
  ) {
    onDeleteUserConversations(filter: $filter, owner: $owner) {
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
