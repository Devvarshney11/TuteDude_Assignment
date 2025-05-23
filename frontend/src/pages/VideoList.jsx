import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoApi } from '../services/api';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [videoProgress, setVideoProgress] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await videoApi.getAllVideos();
        setVideos(data);
        
        // Fetch progress for each video
        const progressData = {};
        for (const video of data) {
          const progress = await videoApi.getVideoProgress(video.id);
          progressData[video.id] = progress;
        }
        setVideoProgress(progressData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">No Videos Available</h2>
        <p className="text-gray-600">There are currently no lecture videos available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Lecture Videos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
              <p className="text-gray-600 mb-4">
                Duration: {Math.floor(video.durationSeconds / 60)}:{(video.durationSeconds % 60).toString().padStart(2, '0')}
              </p>
              
              {videoProgress[video.id] && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${videoProgress[video.id].progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {videoProgress[video.id].progressPercentage}% complete
                  </p>
                </div>
              )}
              
              <Link
                to={`/video/${video.id}`}
                className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                {videoProgress[video.id]?.lastPosition > 0 ? 'Continue Watching' : 'Start Watching'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
