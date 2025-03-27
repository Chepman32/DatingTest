export const setCurrentUser = user => ({
  type: 'SET_CURRENT_USER',
  payload: user,
});
export const setUsersList = users => ({type: 'SET_USERS_LIST', payload: users});
export const setSentLikeeIds = ids => ({
  type: 'SET_SENT_LIKEE_IDS',
  payload: ids,
});
export const setReceivedLikerIds = ids => ({
  type: 'SET_RECEIVED_LIKER_IDS',
  payload: ids,
});
export const setListLoading = loading => ({
  type: 'SET_LIST_LOADING',
  payload: loading,
});
export const setSentLikes = likes => ({type: 'SET_SENT_LIKES', payload: likes});
export const setReceivedLikes = likes => ({
  type: 'SET_RECEIVED_LIKES',
  payload: likes,
});
export const setLikesLoading = loading => ({
  type: 'SET_LIKES_LOADING',
  payload: loading,
});

export const fetchHomeData = navigation => ({
  type: 'FETCH_HOME_DATA',
  payload: navigation,
});
export const fetchLikesData = () => ({type: 'FETCH_LIKES_DATA'});
export const createLikeAction = likeInput => ({
  type: 'CREATE_LIKE',
  payload: likeInput,
});
export const createTestUserAction = gender => ({
  type: 'CREATE_TEST_USER',
  payload: gender,
});
export const addSentLike = like => ({type: 'ADD_SENT_LIKE', payload: like}); // New action to add a single like
export const updateReceivedLike = like => ({
  type: 'UPDATE_RECEIVED_LIKE',
  payload: like,
}); // New action to update a received like
