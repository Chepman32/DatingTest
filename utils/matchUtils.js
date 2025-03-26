import { generateClient } from 'aws-amplify/api';
import { getLike, getUser } from '../src/graphql/queries';
import { updateLike } from '../src/graphql/mutations';
import { v4 as uuidv4 } from 'uuid';

const client = generateClient();

/**
 * Creates a direct conversation for a matched like
 * @param {string} likeId - The ID of the like to update
 * @param {string} currentUserId - The ID of the current user
 * @param {string} initialMessage - Optional initial message to send
 * @returns {Promise<Object>} - The updated like object
 */
export const createDirectConversation = async (likeId, currentUserId, initialMessage = null) => {
  try {
    // Fetch the like data
    const likeData = await client.graphql({
      query: getLike,
      variables: { id: likeId },
      authMode: 'userPool',
    });
    
    const like = likeData.data?.getLike;
    if (!like) {
      throw new Error(`Like with ID ${likeId} not found`);
    }
    
    // Check if this is already matched
    if (!like.isMatched) {
      throw new Error('Cannot create a conversation for a non-matched like');
    }
    
    // Determine if current user is liker or likee
    const isLiker = currentUserId === like.likerId;
    const otherUserId = isLiker ? like.likeeId : like.likerId;
    
    // Get current user's name
    const currentUserData = await client.graphql({
      query: getUser,
      variables: { id: currentUserId },
      authMode: 'userPool',
    });
    const currentUser = currentUserData.data?.getUser;
    
    // Create the direct conversation object
    const messages = [];
    
    // Add initial message if provided
    if (initialMessage) {
      messages.push({
        id: uuidv4(),
        text: initialMessage,
        senderId: currentUserId,
        senderName: currentUser?.name || 'You',
        date: new Date().toISOString(),
      });
    }
    
    const directConversation = {
      startDate: new Date().toISOString(),
      lastMessageDate: initialMessage ? new Date().toISOString() : null,
      messages,
    };
    
    // Update the like with the direct conversation
    const updatedLikeData = await client.graphql({
      query: updateLike,
      variables: {
        input: {
          id: likeId,
          directConversation,
          matchedDate: like.matchedDate || new Date().toISOString(),
        },
      },
      authMode: 'userPool',
    });
    
    return updatedLikeData.data?.updateLike;
  } catch (error) {
    console.error('Error creating direct conversation:', error);
    throw error;
  }
};

/**
 * Adds a message to an existing direct conversation
 * @param {string} likeId - The ID of the like
 * @param {string} senderId - The ID of the message sender
 * @param {string} text - The message text
 * @returns {Promise<Object>} - The updated like object
 */
export const addMessageToDirectConversation = async (likeId, senderId, text) => {
  try {
    // Fetch the like data
    const likeData = await client.graphql({
      query: getLike,
      variables: { id: likeId },
      authMode: 'userPool',
    });
    
    const like = likeData.data?.getLike;
    if (!like) {
      throw new Error(`Like with ID ${likeId} not found`);
    }
    
    // Get sender's name
    const senderData = await client.graphql({
      query: getUser,
      variables: { id: senderId },
      authMode: 'userPool',
    });
    const sender = senderData.data?.getUser;
    
    // Create the new message
    const newMessage = {
      id: uuidv4(),
      text,
      senderId,
      senderName: sender?.name || 'User',
      date: new Date().toISOString(),
    };
    
    // Get existing direct conversation or create a new one
    const directConversation = like.directConversation || {
      startDate: new Date().toISOString(),
      messages: [],
    };
    
    // Add the new message
    const updatedMessages = [...(directConversation.messages || []), newMessage];
    
    // Update the direct conversation
    const updatedDirectConversation = {
      ...directConversation,
      messages: updatedMessages,
      lastMessageDate: new Date().toISOString(),
    };
    
    // Update the like
    const updatedLikeData = await client.graphql({
      query: updateLike,
      variables: {
        input: {
          id: likeId,
          directConversation: updatedDirectConversation,
        },
      },
      authMode: 'userPool',
    });
    
    return updatedLikeData.data?.updateLike;
  } catch (error) {
    console.error('Error adding message to direct conversation:', error);
    throw error;
  }
};