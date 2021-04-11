import TrackDataProps from "../../../data-model/track-data.db";

export default interface Props {
  setUserRating: React.Dispatch<React.SetStateAction<number>>;
  userRating: number;
  trackData: TrackDataProps;
  setTrackTotalVotes: React.Dispatch<React.SetStateAction<number>>;
  setTrackRating: React.Dispatch<React.SetStateAction<number>>;
  trackTotalVotes: number;
}
