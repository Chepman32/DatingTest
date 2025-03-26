import { generateClient } from 'aws-amplify/api';
import { getLike, likesByLikeeId } from '../src/graphql/queries';
import { createLike, updateLike } from '../src/graphql/mutations';
import { createDirectConversation } from '../utils/matchUtils';

const client = generateClient();

/**
 * Example function showing how to create a like and handle matching
 * @param {string} currentUserId - The ID of the current user (liker)
 * @param {string} targetUserId - The ID of the user being liked (likee)
 */
export const handleLikeUser = async (currentUserId, targetUserId) => {
  try {
    // First, check if the target user has already liked the current user
    const existingLikesData = await client.graphql({
      query: likesByLikeeId,
      variables: { 
        likeeId: currentUserId,
        filter: {
          likerId: { eq: targetUserId }
        }
      },
      authMode: 'userPool',
    });
    
    const existingLikes = existingLikesData.data?.likesByLikeeId?.items || [];
    const isMatch = existingLikes.length > 0;
    
    // Create the new like
    const newLikeData = await client.graphql({
      query: createLike,
      variables: {
        input: {
          likerId: currentUserId,
          likeeId: targetUserId,
          isMatched: isMatch,
          matchedDate: isMatch ? new Date().toISOString() : null,
        },
      },
      authMode: 'userPool',
    });
    
    const newLike = newLikeData.data?.createLike;
    
    // If this is a match, update the existing like from the other user
    if (isMatch) {
      const existingLike = existingLikes[0];
      
      // Update the existing like to mark it as matched
      await client.graphql({
        query: updateLike,
        variables: {
          input: {
            id: existingLike.id,
            isMatched: true,
            matchedDate: new Date().toISOString(),
          },
        },
        authMode: 'userPool',
      });
      
      // Create a direct conversation for the new like
      await createDirectConversation(
        newLike.id, 
        currentUserId, 
        "Hi! We matched! 👋"
      );
      
      // You could also create a direct conversation for the existing like
      // if you want both users to see the same conversation
      await createDirectConversation(
        existingLike.id,
        currentUserId,
        "Hi! We matched! 👋"
      );
      
      console.log('Match created successfully!');
      return { isMatch: true, like: newLike };
    }
    
    console.log('Like created successfully!');
    return { isMatch: false, like: newLike };
  } catch (error) {
    console.error('Error handling like:', error);
    throw error;
  }
};