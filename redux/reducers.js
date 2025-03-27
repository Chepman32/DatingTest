import { combineReducers } from 'redux';

const initialUserState = {
  currentUser: null,
  usersList: [],
  sentLikeeIds: [],
  receivedLikerIds: [],
  listLoading: false,
  sentLikes: [],
  receivedLikes: [],
  likesLoading: false,
};

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_USERS_LIST':
      return { ...state, usersList: action.payload };
    case 'SET_SENT_LIKEE_IDS':
      return { ...state, sentLikeeIds: action.payload };
    case 'SET_RECEIVED_LIKER_IDS':
      return { ...state, receivedLikerIds: action.payload };
    case 'SET_LIST_LOADING':
      return { ...state, listLoading: action.runtimepayload };
    case 'SET_SENT_LIKES':
      return { ...state, sentLikes: action.payload };
    case 'SET_RECEIVED_LIKES':
      return { ...state, receivedLikes: action.payload };
    case 'SET_LIKES_LOADING':
      return { ...state, likesLoading: action.payload };
    case 'ADD_SENT_LIKE':
      return { ...state, sentLikes: [...state.sentLikes, action.payload], sentLikeeIds: [...state.sentLikeeIds, action.payload.likeeId] };
    case 'UPDATE_RECEIVED_LIKE':
      return {
        ...state,
        receivedLikes: state.receivedLikes.map(like =>
          like.id === action.payload.id ? { ...like, ...action.payload } : like
        ),
      };
    default:
      return state;
  }
};

export default combineReducers({
  user: userReducer,
});