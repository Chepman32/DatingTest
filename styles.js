// styles.js
import { StyleSheet, Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const CARD_WIDTH = SCREEN_WIDTH - 20;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F4',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: SCREEN_HEIGHT - 180,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImageContainer: {
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: CARD_WIDTH,
    height: '100%',
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: 20,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  ageText: {
    fontSize: 22,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#444',
    marginTop: 12,
    lineHeight: 24,
  },
  likeLabel: {
    position: 'absolute',
    top: 40,
    right: 30,
    transform: [{ rotate: '15deg' }],
    borderWidth: 3,
    borderColor: '#4BD8A5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  likeLabelText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4BD8A5',
  },
  nopeLabel: {
    position: 'absolute',
    top: 40,
    left: 30,
    transform: [{ rotate: '-15deg' }],
    borderWidth: 3,
    borderColor: '#FF4458',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  nopeLabelText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF4458',
  },
  imageNav: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 5,
  },
  activeImageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nopeButton: {
    borderWidth: 2,
    borderColor: '#FF4458',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#4BD8A5',
  },
  noMoreCards: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreCardsText: {
    fontSize: 22,
    color: '#999',
    marginTop: 20,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#FF4458',
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 3,
    borderTopColor: '#FF4458',
  },
  matchesContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  matchesHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  matchesTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  matchItem: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  matchInfo: {
    flex: 1,
    marginLeft: 15,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 15,
    color: '#777',
  },
  matchMeta: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 5,
  },
  unreadBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4458',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  userProfileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  settingsSection: {
    width: '100%',
  },
  settingsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 17,
    marginLeft: 15,
    color: '#333',
  },
  leftArrow: {
    position: 'absolute',
    left: 10,
    top: '50%',
    zIndex: 1
  },
  rightArrow: {
    position: 'absolute',
    right: 10,
    top: '50%',
    zIndex: 1
  },
});