import React from "react";
import { AchievementsProvider } from "./AchievementContext";
import "./App.css";
import MainApp, { ACHIEVEMENTS } from "./MainApp";
import SupabaseAuth from "./SupabaseAuth";

function App() {
    return (
        <AchievementsProvider initialAchievements={ACHIEVEMENTS}>
            <SupabaseAuth />
            <MainApp />
        </AchievementsProvider>
    );
}

export default App;
