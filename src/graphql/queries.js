/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getMatch = /* GraphQL */ `
  query GetMatch($id: ID!) {
    getMatch(id: $id) {
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
export const listMatches = /* GraphQL */ `
  query ListMatches(
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMatches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const matchesByLikerId = /* GraphQL */ `
  query MatchesByLikerId(
    $likerId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    matchesByLikerId(
      likerId: $likerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const matchesByLikeeId = /* GraphQL */ `
  query MatchesByLikeeId(
    $likeeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    matchesByLikeeId(
      likeeId: $likeeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getConversation = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
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
export const listConversations = /* GraphQL */ `
  query ListConversations(
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        senderId
        receiverId
        conversationId
        read
        readAt
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const messagesBySenderId = /* GraphQL */ `
  query MessagesBySenderId(
    $senderId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesBySenderId(
      senderId: $senderId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        text
        senderId
        receiverId
        conversationId
        read
        readAt
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const messagesByReceiverId = /* GraphQL */ `
  query MessagesByReceiverId(
    $receiverId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByReceiverId(
      receiverId: $receiverId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        text
        senderId
        receiverId
        conversationId
        read
        readAt
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const messagesByConversationId = /* GraphQL */ `
  query MessagesByConversationId(
    $conversationId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByConversationId(
      conversationId: $conversationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        text
        senderId
        receiverId
        conversationId
        read
        readAt
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserConversations = /* GraphQL */ `
  query GetUserConversations($id: ID!) {
    getUserConversations(id: $id) {
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
export const listUserConversations = /* GraphQL */ `
  query ListUserConversations(
    $filter: ModelUserConversationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserConversations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        conversationId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userConversationsByUserId = /* GraphQL */ `
  query UserConversationsByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUserConversationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userConversationsByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        conversationId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const userConversationsByConversationId = /* GraphQL */ `
  query UserConversationsByConversationId(
    $conversationId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUserConversationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userConversationsByConversationId(
      conversationId: $conversationId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        conversationId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
