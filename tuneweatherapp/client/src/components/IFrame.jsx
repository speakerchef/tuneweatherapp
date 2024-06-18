// import React from 'react';
//
// const IFrame = ({hidden, playlistId}) => {
//     return (
//         <div>
//             <iframe
//                 src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
//                 width="100%"
//                 // height="480px"
//                 // style={{display: "flex", flexDirection: 'column', minWidth: '768px', minHeight: '480px'}}
//                 allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//                 loading="lazy"
//                 className={`flex min-h-[680px] min-w-[480px] ${!hidden ? 'hidden': ''} sm:mt-14 lg:-mt-1 xl:-mt-40 flex-col md:min-h-[768px] md:min-w-[768px] lg:min-h-[768px] lg:min-w-[1024px] xl:min-w-[1440px]`}
//             />
//         </div>
//     );
// };
//
// export default IFrame;