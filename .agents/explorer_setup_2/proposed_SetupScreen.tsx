'use client';

import React, { useState, useEffect } from 'react';
import { useGameState, Player } from '@/hooks/useGameState';

const COLOR_PALETTE = [
  '#4B45D4', // Brand Indigo
  '#10B981', // Emerald Green
  '#D4156B', // Pink/Magenta
  '#F59E0B', // Amber/Orange
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
];

export default function SetupScreen() {
  const { setScreen, createGame } = useGameState();

  const [gameTitle, setGameTitle] = useState('');
  const [draftPlayers, setDraftPlayers] = useState<Player[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [playerColor, setPlayerColor] = useState('');

  // Auto-select first available color when opening Add modal
  const getFirstAvailableColor = (currentPlayers: Player[], skipId: string | null = null) => {
    const taken = currentPlayers
      .filter((p) => p.id !== skipId)
      .map((p) => p.color.toLowerCase());
    return COLOR_PALETTE.find((c) => !taken.includes(c.toLowerCase())) || COLOR_PALETTE[0];
  };

  const openAddModal = () => {
    if (draftPlayers.length >= 10) return;
    setModalMode('add');
    setEditingPlayerId(null);
    setPlayerName('');
    setPlayerColor(getFirstAvailableColor(draftPlayers));
    setIsModalOpen(true);
  };

  const openEditModal = (player: Player) => {
    setModalMode('edit');
    setEditingPlayerId(player.id);
    setPlayerName(player.name);
    setPlayerColor(player.color);
    setIsModalOpen(true);
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = playerName.trim();
    if (!trimmedName || !playerColor) return;

    if (modalMode === 'add') {
      const newPlayer: Player = {
        id: Math.random().toString(36).substring(2, 9),
        name: trimmedName,
        color: playerColor,
        score: 0,
        isSelected: false,
      };
      setDraftPlayers([...draftPlayers, newPlayer]);
    } else if (modalMode === 'edit' && editingPlayerId) {
      setDraftPlayers(
        draftPlayers.map((p) =>
          p.id === editingPlayerId
            ? { ...p, name: trimmedName, color: playerColor }
            : p
        )
      );
    }
    setIsModalOpen(false);
  };

  const handleDeletePlayer = (playerId: string) => {
    setDraftPlayers(draftPlayers.filter((p) => p.id !== playerId));
  };

  const handleStartGame = () => {
    if (draftPlayers.length === 0) return;
    createGame(gameTitle, draftPlayers);
  };

  const isColorTaken = (color: string) => {
    if (modalMode === 'add') {
      return draftPlayers.some((p) => p.color.toLowerCase() === color.toLowerCase());
    } else {
      return draftPlayers.some(
        (p) => p.id !== editingPlayerId && p.color.toLowerCase() === color.toLowerCase()
      );
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-[#EEEEF8] h-full justify-between relative">
      {/* Scrollable Setup Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 flex flex-col gap-6">
        
        {/* Header Logo & Back Arrow */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setScreen('home')}
            className="p-2 hover:bg-[#F0EFFF] rounded-full text-[#4B45D4] transition-colors cursor-pointer"
            aria-label="Go Back to Home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-[#4B45D4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5-3c-.83 0-1.5-.67-1.5-1.5S18.17 9 19 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
            <span className="text-xl font-extrabold text-[#1A1A2E]">ScoreBoard</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-[#1A1A2E]">Create New Game</h1>

        {/* Title Field Card */}
        <div className="bg-white rounded-[20px] p-5 shadow-sm">
          <label className="block text-[11px] font-extrabold text-[#9999AA] tracking-wider mb-2">GAME TITLE</label>
          <input
            type="text"
            placeholder="Enter game title"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            className="w-full text-lg font-bold text-[#1A1A2E] placeholder-[#9999AA] outline-none border-b-2 border-transparent focus:border-[#4B45D4] pb-1 transition-all"
          />
        </div>

        {/* Players Section Header */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#1A1A2E]">Players</h2>
            <span className="bg-[#4B45D4] text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {draftPlayers.length} ADDED
            </span>
          </div>
          {draftPlayers.length < 10 && (
            <button
              onClick={openAddModal}
              className="w-10 h-10 bg-[#4B45D4] hover:bg-[#3b35be] text-white rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
              aria-label="Add Player"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        {/* Players List */}
        <div className="flex flex-col gap-3">
          {draftPlayers.length === 0 ? (
            <div className="text-center py-10 bg-white/50 border-2 border-dashed border-[#9999AA]/30 rounded-[20px]">
              <p className="text-[#9999AA] font-bold text-sm">No players added yet</p>
              <button
                onClick={openAddModal}
                className="mt-3 text-xs font-extrabold text-[#4B45D4] hover:underline cursor-pointer"
              >
                + ADD FIRST PLAYER
              </button>
            </div>
          ) : (
            draftPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-white rounded-[20px] p-4 flex items-center justify-between shadow-sm border-l-[6px] transition-all"
                style={{ borderLeftColor: player.color }}
              >
                <div className="flex items-center gap-3">
                  {/* Tinted Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                    style={{ backgroundColor: `${player.color}20`, color: player.color }}
                  >
                    {player.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-extrabold text-[#1A1A2E] text-base">{player.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Edit Pencil */}
                  <button
                    onClick={() => openEditModal(player)}
                    className="p-2 hover:bg-[#EEEEF8] rounded-full text-[#9999AA] hover:text-[#4B45D4] transition-colors cursor-pointer"
                    aria-label={`Edit ${player.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  {/* Delete Trash */}
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="p-2 hover:bg-red-50 rounded-full text-[#9999AA] hover:text-[#E04040] transition-colors cursor-pointer"
                    aria-label={`Delete ${player.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Max Players Reminder */}
        {draftPlayers.length === 10 && (
          <p className="text-xs text-center text-[#9999AA] font-bold mt-2">
            Maximum player limit (10) reached.
          </p>
        )}
      </div>

      {/* START GAME Sticky Button at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#EEEEF8] via-[#EEEEF8] to-[#EEEEF8]/0">
        <button
          onClick={handleStartGame}
          disabled={draftPlayers.length === 0}
          className={`w-full py-4 rounded-full font-extrabold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
            draftPlayers.length === 0
              ? 'bg-[#9999AA] shadow-none opacity-50 cursor-not-allowed'
              : 'bg-[#4B45D4] shadow-indigo-600/30 hover:bg-[#3b35be] active:scale-[0.98]'
          }`}
        >
          <span>⚡ START GAME</span>
        </button>
      </div>

      {/* Add/Edit Player Modal Dialog Overlay */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6 animate-fade-in">
          <form
            onSubmit={handleSavePlayer}
            className="w-full bg-white rounded-[30px] p-6 shadow-2xl flex flex-col gap-6"
          >
            <h3 className="text-xl font-extrabold text-[#1A1A2E]">
              {modalMode === 'add' ? 'Add Player' : 'Edit Player'}
            </h3>

            {/* Input Name */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#9999AA] tracking-wider mb-2">PLAYER NAME</label>
              <input
                type="text"
                placeholder="Enter player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
                maxLength={20}
                className="w-full bg-[#EEEEF8] rounded-xl px-4 py-3 text-base font-bold text-[#1A1A2E] placeholder-[#9999AA] outline-none border-2 border-transparent focus:border-[#4B45D4] transition-all"
              />
            </div>

            {/* Color Palette Picker */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#9999AA] tracking-wider mb-2">SELECT ACCENT COLOR</label>
              <div className="grid grid-cols-4 gap-3 justify-items-center">
                {COLOR_PALETTE.map((color) => {
                  const taken = isColorTaken(color);
                  const isSelected = playerColor.toLowerCase() === color.toLowerCase();
                  return (
                    <button
                      key={color}
                      type="button"
                      disabled={taken}
                      onClick={() => setPlayerColor(color)}
                      className={`w-10 h-10 rounded-full transition-all flex items-center justify-center border-2 cursor-pointer ${
                        isSelected ? 'border-[#1A1A2E] scale-110 shadow-md' : 'border-transparent'
                      } ${taken ? 'opacity-20 cursor-not-allowed' : 'hover:scale-105'}`}
                      style={{ backgroundColor: color }}
                      title={taken ? 'Color already chosen' : color}
                    >
                      {isSelected && (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 border-2 border-[#EEEEF8] text-[#9999AA] font-extrabold rounded-full hover:bg-[#EEEEF8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#4B45D4] text-white font-extrabold rounded-full hover:bg-[#3b35be] transition-colors cursor-pointer"
              >
                {modalMode === 'add' ? 'Add' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
