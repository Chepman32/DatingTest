import { put, takeEvery, call, all, select } from 'redux-saga/effects';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../src/graphql/queries';
import * as mutations from '../src/graphql/mutations';
import {
  setCurrentUser,
  setUsersList,
  setSentLikeeIds,
  setReceivedLikerIds,
  setListLoading,
  setSentLikes,
  setReceivedLikes,
  setLikesLoading,
  addSentLike,
  updateReceivedLike,
} from './actions';

const client = generateClient();

function* fetchHomeDataSaga({ payload: navigation }) {
  yield put(setListLoading(true));
  try {
    const { userId, username } = yield call(getCurrentUser);
    const currentUserId = userId;

    const existingUser = yield call([client, client.graphql], {
      query: queries.getUser,
      variables: { id: currentUserId },
      authMode: 'userPool',
    });

    if (!existingUser.data.getUser) {
      const newUser = {
        id: currentUserId,
        name: username || 'New User',
        age: 25,
        bio: 'Tell us about yourself',
        imageUrl: "https://us-east-2.admin.amplifyapp.com/static/media/amplify-logo.677fad72.svg",
        location: 'Your Location',
        gender: 'MALE',
        lookingFor: ['FEMALE'],
        interests: ['dating'],
      };

      const createdUser = yield call([client, client.graphql], {
        query: mutations.createUser,
        variables: { input: newUser },
        authMode: 'userPool',
      });

      yield put(setCurrentUser(createdUser.data.createUser));
      navigation.navigate('ProfileEdit');
      return;
    }

    yield put(setCurrentUser(existingUser.data.getUser));

    const sentLikesData = yield call([client, client.graphql], {
      query: queries.likesByLikerId,
      variables: { likerId: currentUserId },
      authMode: 'userPool',
    });
    const sentLikes = sentLikesData.data?.likesByLikerId?.items || [];
    const likeeIds = sentLikes.map(like => like.likeeId);
    yield put(setSentLikeeIds(likeeIds));

    const receivedLikesData = yield call([client, client.graphql], {
      query: queries.likesByLikeeId,
      variables: { likeeId: currentUserId },
      authMode: 'userPool',
    });
    const receivedLikes = receivedLikesData.data?.likesByLikeeId?.items || [];
    const likerIds = receivedLikes.map(like => like.likerId) || []; // Ensure fallback to empty array
    yield put(setReceivedLikerIds(likerIds));

    const usersData = yield call([client, client.graphql], {
      query: queries.listUsers,
      authMode: 'userPool',
    });

    const potentialMatches = usersData.data.listUsers.items.filter(user =>
      user.id !== currentUserId &&
      existingUser.data.getUser.lookingFor.includes(user.gender) &&
      !sentLikes.some(like => like.likeeId === user.id) &&
      !receivedLikes.some(like => like.likerId === user.id)
    );

    yield put(setUsersList(potentialMatches));
  } catch (error) {
    console.error('Error in fetchHomeDataSaga:', error);
    // Set fallback values in case of error
    yield put(setReceivedLikerIds([]));
    yield put(setSentLikeeIds([]));
    yield put(setUsersList([]));
  }
  yield put(setListLoading(false));
}

function* fetchLikesDataSaga() {
  yield put(setLikesLoading(true));
  try {
    const { userId } = yield call(getCurrentUser);

    const sentLikesData = yield call([client, client.graphql], {
      query: queries.likesByLikerId,
      variables: { likerId: userId },
      authMode: 'userPool',
    });
    const sentLikesList = sentLikesData.data?.likesByLikerId?.items || [];
    const enrichedSentLikes = [];
    for (let like of sentLikesList) {
      if (!like.likee && like.likeeId) {
        const userData = yield call([client, client.graphql], {
          query: queries.getUser,
          variables: { id: like.likeeId },
          authMode: 'userPool',
        });
        like.likee = userData.data?.getUser;
      }
      if (like.isMatched && like.conversationId && !like.conversation) {
        const conversationData = yield call([client, client.graphql], {
          query: queries.getConversation,
          variables: { id: like.conversationId },
          authMode: 'userPool',
        });
        like.conversation = conversationData.data?.getConversation;
      }
      if (like.likee) {
        enrichedSentLikes.push(like);
      } else {
        yield call([client, client.graphql], {
          query: mutations.deleteLike,
          variables: { input: { id: like.id } },
          authMode: 'userPool',
        });
      }
    }
    yield put(setSentLikes(enrichedSentLikes));

    const receivedLikesData = yield call([client, client.graphql], {
      query: queries.likesByLikeeId,
      variables: { likeeId: userId },
      authMode: 'userPool',
    });
    const receivedLikesList = receivedLikesData.data?.likesByLikeeId?.items || [];
    const enrichedReceivedLikes = [];
    for (let like of receivedLikesList) {
      if (!like.liker && like.likerId) {
        const userData = yield call([client, client.graphql], {
          query: queries.getUser,
          variables: { id: like.likerId },
          authMode: 'userPool',
        });
        like.liker = userData.data?.getUser;
      }
      if (like.isMatched && like.conversationId && !like.conversation) {
        const conversationData = yield call([client, client.graphql], {
          query: queries.getConversation,
          variables: { id: like.conversationId },
          authMode: 'userPool',
        });
        like.conversation = conversationData.data?.getConversation;
      }
      if (like.liker) {
        enrichedReceivedLikes.push(like);
      } else {
        yield call([client, client.graphql], {
          query: mutations.deleteLike,
          variables: { input: { id: like.id } },
          authMode: 'userPool',
        });
      }
    }
    yield put(setReceivedLikes(enrichedReceivedLikes));
  } catch (error) {
    console.error('Error in fetchLikesDataSaga:', error);
    yield put(setSentLikes([]));
    yield put(setReceivedLikes([]));
  }
  yield put(setLikesLoading(false));
}

function* createLikeSaga({ payload }) {
  try {
    const likeInput = {
      likerId: payload.likerId,
      likeeId: payload.likeeId,
      isMatched: payload.isMatched,
    };

    const createLikeResponse = yield call([client, client.graphql], {
      query: mutations.createLike,
      variables: { input: likeInput },
      authMode: 'userPool',
    });
    const createdLike = createLikeResponse.data.createLike;

    // Fetch the liked user's data to enrich the like object
    const likeeData = yield call([client, client.graphql], {
      query: queries.getUser,
      variables: { id: payload.likeeId },
      authMode: 'userPool',
    });
    const enrichedLike = { ...createdLike, likee: likeeData.data.getUser };

    // Update sentLikes in Redux store
    yield put(addSentLike(enrichedLike));

    // Update usersList by removing the liked user
    yield put(setUsersList(
      yield select(state => state.user.usersList.filter(user => user.id !== payload.likeeId))
    ));

    // Check for mutual like with a safeguard
    const receivedLikerIds = yield select(state => state.user.receivedLikerIds || []);
    if (receivedLikerIds.includes(payload.likeeId)) {
      const existingLikeData = yield call([client, client.graphql], {
        query: queries.likesByLikeeId,
        variables: { likeeId: payload.likerId },
        authMode: 'userPool',
      });
      const existingLike = existingLikeData.data.likesByLikeeId.items.find(
        like => like.likerId === payload.likeeId
      );
      if (existingLike) {
        yield call([client, client.graphql], {
          query: mutations.updateLike,
          variables: { input: { id: existingLike.id, isMatched: true } },
          authMode: 'userPool',
        });
        yield call([client, client.graphql], {
          query: mutations.updateLike,
          variables: { input: { id: createdLike.id, isMatched: true } },
          authMode: 'userPool',
        });

        // Update the received like in Redux store
        yield put(updateReceivedLike({ id: existingLike.id, isMatched: true }));
        yield put(addSentLike({ ...enrichedLike, isMatched: true }));
      }
    }
  } catch (error) {
    console.error('Error in createLikeSaga:', error);
  }
}

function* createTestUserSaga({ payload: gender }) {
  try {
    const testUserGender = gender === 'MALE' ? 'FEMALE' : 'MALE';
    const testUsername = `test_${testUserGender.toLowerCase()}_${Date.now()}`;
    const testUser = {
      id: `test-${Date.now()}`,
      name: testUsername,
      age: 25,
      bio: 'Test user profile',
      imageUrl: "https://us-east-2.admin.amplifyapp.com/static/media/amplify-logo.677fad72.svg",
      location: 'Test Location',
      gender: testUserGender,
      lookingFor: [gender],
      interests: ['dating'],
      owner: testUsername,
    };

    yield call([client, client.graphql], {
      query: mutations.createUser,
      variables: { input: testUser },
      authMode: 'userPool',
    });

    yield put({ type: 'FETCH_HOME_DATA' });
  } catch (error) {
    console.error('Error in createTestUserSaga:', error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery('FETCH_HOME_DATA', fetchHomeDataSaga),
    takeEvery('FETCH_LIKES_DATA', fetchLikesDataSaga),
    takeEvery('CREATE_LIKE', createLikeSaga),
    takeEvery('CREATE_TEST_USER', createTestUserSaga),
  ]);
}