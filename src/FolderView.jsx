import { useState } from "react";
import Button from '@mui/material/Button';

function FolderView() {
    const [count, setCount] = useState(0);

    return (
        <>
            <Button onClick={() => setCount((count) => count + 1)}>count is {count}</Button>
        </>
    );
}

export default FolderView;
