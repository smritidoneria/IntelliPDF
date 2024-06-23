// UploadButton.tsx
"use client"
import React, { useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from './ui/button'; // Assuming Button component is imported from './ui/button'

const UploadButtons = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
            {/* Single parent element wrapper */}
            <div>
                {/* Dialog content */}
                <DialogTrigger  onClick={()=>setIsOpen(true)}asChild>
                    <Button>Upload pdf</Button>
                </DialogTrigger>


                <DialogContent>
                    exapl
                </DialogContent>
            </div>
        </Dialog>
    );
}

export default UploadButtons;