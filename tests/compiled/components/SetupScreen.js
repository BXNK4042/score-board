"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetupScreen = SetupScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useGameState_1 = require("@/hooks/useGameState");
const HomeScreen_1 = require("@/components/HomeScreen");
const PlayerDialog_1 = require("@/components/PlayerDialog");
function SetupScreen({ setupTitle, setupPlayers, onUpdateTitle, onAddPlayer, onUpdatePlayer, onDeletePlayer, onStartGame, onCancel, }) {
    const [dialogOpen, setDialogOpen] = (0, react_1.useState)(false);
    const [editingPlayer, setEditingPlayer] = (0, react_1.useState)(null);
    // Pick first available color in palette for default selection in add dialog
    const getFirstAvailableColor = () => {
        const usedColors = setupPlayers.map((p) => p.color.toLowerCase());
        const available = useGameState_1.PALETTE.find((c) => !usedColors.includes(c.toLowerCase()));
        return available || useGameState_1.PALETTE[0];
    };
    const handleOpenAdd = () => {
        setEditingPlayer(null);
        setDialogOpen(true);
    };
    const handleOpenEdit = (player) => {
        setEditingPlayer(player);
        setDialogOpen(true);
    };
    const handleSave = (name, color) => {
        if (editingPlayer) {
            onUpdatePlayer(editingPlayer.id, name, color);
        }
        else {
            onAddPlayer(name, color);
        }
    };
    const isStartDisabled = !setupTitle.trim() || setupPlayers.length === 0;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col flex-1 bg-[#EEEEF8] text-[#1A1A2E] w-full max-w-[390px] mx-auto min-h-screen relative p-6 justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between pt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(HomeScreen_1.GamepadIcon, {}), (0, jsx_runtime_1.jsx)("span", { className: "font-extrabold text-xl tracking-tight text-[#4B45D4]", children: "ScoreBoard" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "text-sm font-bold text-[#9999AA] hover:text-[#1A1A2E] cursor-pointer", children: "Cancel" })] }), (0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-extrabold tracking-tight", children: "Create New Game" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-4 rounded-[20px] flex flex-col gap-1 shadow-sm", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "game-title-input", className: "text-[10px] font-extrabold uppercase tracking-wider text-[#9999AA]", children: "Title" }), (0, jsx_runtime_1.jsx)("input", { id: "game-title-input", type: "text", value: setupTitle, onChange: (e) => onUpdateTitle(e.target.value), placeholder: "Enter game title", maxLength: 40, className: "w-full text-base font-bold text-[#1A1A2E] border-none focus:outline-none p-0" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mt-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-extrabold text-lg", children: "Players" }), (0, jsx_runtime_1.jsxs)("span", { className: "px-3 py-1 text-xs font-bold bg-[#4B45D4] text-white rounded-full", children: [setupPlayers.length, " ADDED"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-1", children: setupPlayers.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8 text-[#9999AA] text-sm font-medium", children: "No players added yet. Tap '+' below to add players." })) : (setupPlayers.map((player) => ((0, jsx_runtime_1.jsxs)("div", { style: { borderLeftColor: player.color }, className: "bg-white border-l-8 p-4 rounded-[20px] shadow-sm flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { style: { backgroundColor: `${player.color}15` }, className: "w-9 h-9 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { style: { color: player.color }, className: "font-extrabold text-sm", children: player.name.charAt(0).toUpperCase() }) }), (0, jsx_runtime_1.jsx)("span", { className: "font-extrabold text-base text-[#1A1A2E]", children: player.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => handleOpenEdit(player), className: "p-1 hover:bg-[#EEEEF8] rounded-lg cursor-pointer", "aria-label": `Edit ${player.name}`, children: (0, jsx_runtime_1.jsx)(HomeScreen_1.PencilIcon, {}) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => onDeletePlayer(player.id), className: "p-1 hover:bg-[#EEEEF8] rounded-lg cursor-pointer", "aria-label": `Delete ${player.name}`, children: (0, jsx_runtime_1.jsx)(HomeScreen_1.TrashIcon, {}) })] })] }, player.id)))) }), setupPlayers.length < 10 && ((0, jsx_runtime_1.jsxs)("button", { onClick: handleOpenAdd, className: "w-full py-4 border-2 border-dashed border-[#9999AA]/40 text-[#4B45D4] font-extrabold rounded-[20px] flex items-center justify-center gap-2 hover:bg-white/50 cursor-pointer transition-colors mt-2", children: [(0, jsx_runtime_1.jsx)(HomeScreen_1.PlusIcon, { className: "w-5 h-5" }), (0, jsx_runtime_1.jsx)("span", { children: "ADD PLAYER" })] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full pt-6 pb-2", children: (0, jsx_runtime_1.jsxs)("button", { onClick: onStartGame, disabled: isStartDisabled, className: `w-full py-4 text-white font-extrabold rounded-full flex items-center justify-center gap-1 transition-transform cursor-pointer ${isStartDisabled
                        ? 'bg-[#9999AA]/60 opacity-60 cursor-not-allowed'
                        : 'bg-[#4B45D4] shadow-md shadow-[#4B45D4]/20 active:scale-98'}`, children: [(0, jsx_runtime_1.jsx)(HomeScreen_1.BoltIcon, {}), (0, jsx_runtime_1.jsx)("span", { children: "START GAME" })] }) }), dialogOpen && ((0, jsx_runtime_1.jsx)(PlayerDialog_1.PlayerDialog, { isOpen: dialogOpen, onClose: () => setDialogOpen(false), onSave: handleSave, title: editingPlayer ? 'Edit Player' : 'Add Player', initialName: editingPlayer ? editingPlayer.name : '', initialColor: editingPlayer ? editingPlayer.color : getFirstAvailableColor(), usedColors: setupPlayers.map((p) => p.color) }, editingPlayer ? editingPlayer.id : 'new'))] }));
}
