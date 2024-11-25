import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';

// SortableItem Component
const SortableItem = ({ id, video }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-4 bg-white rounded-lg border border-gray-100 mb-2 cursor-move"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium">
                        {video.templateNames}
                    </h4>
                    <p className="text-sm text-gray-500">
                        Created {new Date(video.created_at).toLocaleDateString()}
                    </p>
                </div>
                <button 
                    onClick={() => window.open(video.url, '_blank')}
                    className="text-gray-400 hover:text-gray-600"
                >
                    Preview
                </button>
            </div>
        </div>
    );
};

const PlaylistManager = ({ media }) => {
    const [playlists, setPlaylists] = useState([
        { id: 'unassigned', name: 'Unassigned Files', files: [], isDefault: true }
    ]);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    // Set up sensors
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    useEffect(() => {
        // Initialize unassigned files with media
        if (media && media.length > 0) {
            setPlaylists(prev => [{
                ...prev[0],
                files: media
            }]);
        }
    }, [media]);

    const createPlaylist = () => {
        if (!newPlaylistName.trim()) return;
        setPlaylists(prev => [...prev, {
            id: Date.now().toString(),
            name: newPlaylistName,
            files: [],
            isDefault: false
        }]);
        setNewPlaylistName('');
    };

    const handleDeletePlaylist = (playlistId) => {
        setPlaylists(prev => {
            const playlist = prev.find(p => p.id === playlistId);
            const unassigned = prev.find(p => p.id === 'unassigned');
            return [
                { ...unassigned, files: [...unassigned.files, ...playlist.files] },
                ...prev.filter(p => p.id !== playlistId && p.id !== 'unassigned')
            ];
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            // Handle the drag end logic here
            console.log('Dragged', active.id, 'over', over.id);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="mt-6">
                <div className="flex items-center gap-4 mb-6">
                    <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="New playlist name"
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button 
                        onClick={createPlaylist}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg"
                    >
                        Create Playlist
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {playlists.map(playlist => (
                        <div key={playlist.id} className="p-6 bg-white rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">{playlist.name}</h3>
                                    <span className="text-sm text-gray-500">
                                        {playlist.files.length} files
                                    </span>
                                </div>
                                {!playlist.isDefault && (
                                    <button 
                                        onClick={() => handleDeletePlaylist(playlist.id)}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <SortableContext 
                                items={playlist.files.map(f => f.url)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {playlist.files.map((video) => (
                                        <SortableItem
                                            key={video.url}
                                            id={video.url}
                                            video={video}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </div>
                    ))}
                </div>
            </div>
        </DndContext>
    );
};

export default PlaylistManager;
