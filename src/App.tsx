import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import { UserDataType } from './types';

function App() {
    const [user, setUser] = useState<UserDataType | null>(null);

    return (
        <div>
            <Dashboard userData={user} setUser={setUser} />
        </div>
    );
}

export default App;
