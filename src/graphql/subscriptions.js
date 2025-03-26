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
export const onCreateLike = /* GraphQL */ `
  subscription OnCreateLike(
    $filter: ModelSubscriptionLikeFilterInput
    $owner: String
  ) {
    onCreateLike(filter: $filter, owner: $owner) {
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
      isMatched
      matchedDate
      conversationId
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        likeId
        createdAt
        updatedAt
        owner
        __typename
      }
      directConversation {
        startDate
        lastMessageDate
        __typename
      }
      _directConversationString
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateLike = /* GraphQL */ `
  subscription OnUpdateLike(
    $filter: ModelSubscriptionLikeFilterInput
    $owner: String
  ) {
    onUpdateLike(filter: $filter, owner: $owner) {
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
      isMatched
      matchedDate
      conversationId
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        likeId
        createdAt
        updatedAt
        owner
        __typename
      }
      directConversation {
        startDate
        lastMessageDate
        __typename
      }
      _directConversationString
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteLike = /* GraphQL */ `
  subscription OnDeleteLike(
    $filter: ModelSubscriptionLikeFilterInput
    $owner: String
  ) {
    onDeleteLike(filter: $filter, owner: $owner) {
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
      isMatched
      matchedDate
      conversationId
      conversation {
        id
        name
        lastMessageText
        lastMessageSentAt
        lastMessageSenderId
        likeId
        createdAt
        updatedAt
        owner
        __typename
      }
      directConversation {
        startDate
        lastMessageDate
        __typename
      }
      _directConversationString
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
      likeId
      like {
        id
        likerId
        likeeId
        isMatched
        matchedDate
        conversationId
        _directConversationString
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
      likeId
      like {
        id
        likerId
        likeeId
        isMatched
        matchedDate
        conversationId
        _directConversationString
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
      likeId
      like {
        id
        likerId
        likeeId
        isMatched
        matchedDate
        conversationId
        _directConversationString
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
        likeId
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
        likeId
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
        likeId
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
        likeId
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
        likeId
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
        likeId
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
