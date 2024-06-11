import React from 'react';

const IFrame = ({hidden, playlistId}) => {
    return (
        <div>
            <iframe src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
                    width="100%"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className={`hidden flex min-h-[768px] min-w-[368px] flex-col md:min-h-[768px] md:min-w-[768px] lg:min-h-[768px] lg:min-w-[1024px]`}/>
        </div>
    );
};

export default IFrame;