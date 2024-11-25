import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withAuth from '@/components/withAuth';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import styles from '@/styles/Home.module.css';
import JSZip from 'jszip';

const MediaItem = ({ medi, index, moveItem }) => {
    const [{ isDragging }, dragRef] = useDrag({
        type: 'MEDIA_ITEM',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: 'MEDIA_ITEM',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    const dragHandleRef = (node) => {
        dragRef(node);
    };

<<<<<<< HEAD
    // Add device detection
=======
    const handleShare = async (url) => {
        try {
            // First fetch the video
            const response = await fetch(url);
            const blob = await response.blob();
            
            // Create a File object from the blob
            const file = new File([blob], `${medi.templateNames}.mp4`, {
                type: 'video/mp4'
            });

            // Check if the device supports sharing
            if (navigator.share && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: medi.templateNames,
                    });
                    console.log('Shared successfully');
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error('Error sharing:', error);
                        // Fallback to normal download if sharing fails
                        handleDownload(url);
                    }
                }
            } else {
                // Fallback for devices that don't support sharing
                handleDownload(url);
            }
        } catch (error) {
            console.error('Error preparing file:', error);
        }
    };

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${medi.templateNames}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    // Add this function to check if it's a mobile device
>>>>>>> e4ac3b22c094014e3c0d275fe669d8ffb70275ee
    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

<<<<<<< HEAD
    // Handle download for desktop
    const handleDownload = async () => {
        const response = await fetch(medi.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = medi.templateNames || 'download';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    // Updated mobile share handler to use native share sheet
    const handleShare = async () => {
        try {
            // Use Web Share API which will show native iOS share sheet
            if (navigator.share) {
                const response = await fetch(medi.url);
                const blob = await response.blob();
                const file = new File([blob], `${medi.templateNames || 'video'}.mp4`, { type: blob.type });
                
                await navigator.share({
                    files: [file],
                    title: medi.templateNames,
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

=======
>>>>>>> e4ac3b22c094014e3c0d275fe669d8ffb70275ee
    return (
        <div 
            ref={dropRef}
            className="group hover:bg-gray-50 transition-all duration-150 ease-in-out transform"
            style={{ 
                opacity: isDragging ? 0.5 : 1,
                border: '1px solid #e5e7eb',
                marginBottom: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
                transition: 'transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
            }}
        >
            <li className="flex items-center p-6">
                <div 
                    ref={dragHandleRef}
                    className="invisible group-hover:visible cursor-move mr-4 text-gray-400 
                             hover:text-gray-600 transition-all duration-150 ease-in-out
                             transform hover:scale-110"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                    </svg>
                </div>

                <div className='w-[70%]'>
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{medi.templateNames}</h3>
                        <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                            Finished
                        </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>Created {medi.created_at.toLocaleDateString()}</span>
                        <span className="mx-2"></span>
                        <span>By {localStorage.getItem('userName')}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <button 
                        onClick={() => window.open(medi.url, '_blank')}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Preview
                    </button>
<<<<<<< HEAD

                    {!isMobileDevice() ? (
                        <button 
                            onClick={handleDownload}
                            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Download
                        </button>
                    ) : (
                        <button 
                            onClick={handleShare}
=======
                    
                    {!isMobileDevice() && (
                        <button 
                            onClick={() => handleDownload(medi.url)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Download
                        </button>
                    )}

                    {isMobileDevice() && (
                        <button 
                            onClick={() => handleShare(medi.url)}
>>>>>>> e4ac3b22c094014e3c0d275fe669d8ffb70275ee
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Share
                        </button>
                    )}
                </div>
            </li>
        </div>
    );
};

const Media = () => {
    const [media, setMedia] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [userID, setUserID] = useState(null);  
    const [loading, setLoading] = useState(false);
    const [mediaOrder, setMediaOrder] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/`;
    const API_KEY = process.env.NEXT_PUBLIC_AIRTABLE_API_KEY;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setUserID(storedUserId);
            const savedOrder = localStorage.getItem(`mediaOrder-${storedUserId}`);
            if (savedOrder) {
                setMediaOrder(JSON.parse(savedOrder));
            }
        }
    }, []);

    const getAllMedia = async (page) => {
        setLoading(true);
        try {
            const pageSize = 30;

            if (!userID) {
                console.error('User ID not found in localStorage');
                return { records: [], hasMore: false };
            }

            const filterFormula = encodeURIComponent(`{userID (from userID)} = '${userID}'`);
            const offset = page > 1 ? `&offset=${(page - 1) * pageSize}` : '';
            
            const url = `${API_URL}tblWEuXbE96RagR0E?maxRecords=${pageSize}${offset}&filterByFormula=${filterFormula}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                },
            });

            if (!response.ok) {
                return { records: [], hasMore: false };
            }

            const data = await response.json();
            const dataArr = data.records
                .map((record) => {
                    if (record?.fields?.finished_URL_AWS) {
                        return {
                            url: record.fields.finished_URL_AWS,
                            templateNames: record.fields.creatomateTemplateName,
                            created_at: new Date(record.fields.createdTime),
                        };
                    }
                    return null;
                })
                .filter((item) => item !== null);

            return { records: dataArr, hasMore: data.records.length === pageSize };
        } catch (error) {
            console.error('Error fetching media data:', error);
            return { records: [], hasMore: false };
        } finally {
            setLoading(false);
        }
    };

    const fetchMedia = async () => {
        if (userID) {
            const { records, hasMore } = await getAllMedia(page);
            let orderedRecords = [...records];
            
            if (mediaOrder.length > 0) {
                const recordMap = new Map(records.map(record => [record.url, record]));
                orderedRecords = mediaOrder
                    .map(url => recordMap.get(url))
                    .filter(record => record);
                
                records.forEach(record => {
                    if (!mediaOrder.includes(record.url)) {
                        orderedRecords.push(record);
                    }
                });
            }
            
            setMedia((prevMedia) => [...prevMedia, ...orderedRecords]);
            setHasMore(hasMore);
        }
    };

    const moveItem = (fromIndex, toIndex) => {
        requestAnimationFrame(() => {
            setMedia((prevMedia) => {
                const updatedMedia = [...prevMedia];
                const [movedItem] = updatedMedia.splice(fromIndex, 1);
                updatedMedia.splice(toIndex, 0, movedItem);
                
                const newOrder = updatedMedia.map(item => item.url);
                if (userID) {
                    localStorage.setItem(`mediaOrder-${userID}`, JSON.stringify(newOrder));
                    setMediaOrder(newOrder);
                }
                
                return updatedMedia;
            });
        });
    };

    useEffect(() => {
        fetchMedia();
    }, [page, userID]);

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const setIsOpen = () => {
        setSidebarOpen(false);
    };

    async function downloadMediaAsZip(urls) {
        const zip = new JSZip();
        
        const downloads = urls.map(async (url, index) => {
            const response = await fetch(url);
            const blob = await response.blob();
            zip.file(`media_${index + 1}.mp4`, blob);
        });
        
        await Promise.all(downloads);
        
        const zipBlob = await zip.generateAsync({type: 'blob'});
        const zipUrl = window.URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = zipUrl;
        link.download = 'media_files.zip';
        link.click();
        window.URL.revokeObjectURL(zipUrl);
    }

    return (
        <div>
            <Head>
                <title>Media</title>
                <meta name="description" content="Home page showing all templates" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex h-screen">
                <Sidebar setIsOpen={setIsOpen} isOpen={isSidebarOpen} />
                <div className="flex-1 flex flex-col w-[80%]">
                    <Header toggleSidebar={toggleSidebar} />
                    {loading ? (
                        <div className="flex justify-center items-center h-screen">
                            <div className={styles.loader} />
                        </div>
                    ) : (
                        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                            <DndProvider backend={HTML5Backend}>
                                <div className="mt-5">
                                    {media.map((medi, index) => (
                                        <MediaItem
                                            key={medi.url}
                                            medi={medi}
                                            index={index}
                                            moveItem={moveItem}
                                        />
                                    ))}
                                </div>
                            </DndProvider>
                            <div className='center'>
                                {hasMore && page != 1 && (
                                    <button className='btnblack' onClick={loadMore}>
                                        Load More
                                    </button>
                                )}
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withAuth(Media);