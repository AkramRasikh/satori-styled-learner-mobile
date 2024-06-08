import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-seek', ({position}) => {
    console.log('## position remote-seek: ', position);
    TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener('remote-jump-forward', async () => {
    console.log('## Jumping forward!');
    let position = await TrackPlayer.getPosition();
    TrackPlayer.seekTo(position + 5); // Jump forward 5 seconds
  });

  TrackPlayer.addEventListener('remote-jump-backward', async () => {
    let position = await TrackPlayer.getPosition();
    TrackPlayer.seekTo(Math.max(0, position - 5)); // Jump back 5 seconds
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.stop();
  });
};
