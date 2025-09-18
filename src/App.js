import React from "react";
import { AchievementsProvider } from "./AchievementContext";
import "./App.css";
import MainApp, { ACHIEVEMENTS } from "./MainApp";

function App() {
    return (
        <AchievementsProvider initialAchievements={ACHIEVEMENTS}>
            <MainApp />
        </AchievementsProvider>
    );
}

export default App;
