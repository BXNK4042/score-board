"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDialog = PlayerDialog;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useGameState_1 = require("@/hooks/useGameState");
function PlayerDialog({ isOpen, onClose, onSave, title, initialName = '', initialColor = useGameState_1.PALETTE[0], usedColors = [], }) {
    const [name, setName] = (0, react_1.useState)(initialName);
    const [color, setColor] = (0, react_1.useState)(initialColor);
    const [error, setError] = (0, react_1.useState)('');
    if (!isOpen)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Player name cannot be empty');
            return;
        }
        // Perform duplicate color check (case insensitive), ignoring the player's own current color
        const colorLower = color.toLowerCase();
        const isColorUsed = usedColors.some((c) => c.toLowerCase() === colorLower) && colorLower !== initialColor.toLowerCase();
        if (isColorUsed) {
            setError('Color is already in use by another player');
            return;
        }
        onSave(name, color);
        onClose();
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 bg-black/40 flex items-end justify-center sm:items-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white w-full max-w-[390px] rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-extrabold text-xl mb-4 text-[#1A1A2E]", children: title }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-1", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "player-name-input", className: "text-[10px] font-bold uppercase tracking-wider text-[#9999AA]", children: "Player Name" }), (0, jsx_runtime_1.jsx)("input", { id: "player-name-input", type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "Enter name", maxLength: 20, className: "w-full px-4 py-3 bg-[#EEEEF8] rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-[#4B45D4] text-[#1A1A2E]", autoFocus: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-[10px] font-bold uppercase tracking-wider text-[#9999AA]", children: "Select Color Accent" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-6 gap-3", children: useGameState_1.PALETTE.map((c) => {
                                        const isUsed = usedColors.some((uc) => uc.toLowerCase() === c.toLowerCase()) && c.toLowerCase() !== initialColor.toLowerCase();
                                        const isSelected = color === c;
                                        return ((0, jsx_runtime_1.jsx)("button", { type: "button", disabled: isUsed, onClick: () => {
                                                setColor(c);
                                                setError('');
                                            }, style: { backgroundColor: c }, className: `h-11 rounded-full border-4 transition-all relative flex items-center justify-center cursor-pointer ${isSelected ? 'border-white ring-2 ring-[#4B45D4]' : 'border-transparent'} ${isUsed ? 'opacity-20 cursor-not-allowed' : ''}`, "aria-label": `Select color ${c}`, children: isUsed && ((0, jsx_runtime_1.jsx)("span", { className: "text-white text-xs font-bold absolute", children: "\u2715" })) }, c));
                                    }) })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "text-[#E04040] text-xs font-semibold px-1", children: error })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 pt-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onClose, className: "flex-1 py-4 bg-[#EEEEF8] text-[#1A1A2E] font-bold rounded-2xl cursor-pointer active:scale-98 transition-transform", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "flex-1 py-4 bg-[#4B45D4] text-white font-bold rounded-2xl cursor-pointer active:scale-98 transition-transform", children: "Save" })] })] })] }) }));
}
