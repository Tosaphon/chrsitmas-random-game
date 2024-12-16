import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { QRCodeSVG } from 'qrcode.react'; // Import สำหรับสร้าง QR Code
import './styles.css';

const client = generateClient<Schema>();

export default function Dashboard() {
    const [numbers, setNumbers] = useState<{ id: string; number: string }[]>([]);
    const [stage, setStage] = useState<'default' | 'pairing'>('default');
    const [pairs, setPairs] = useState<number[][]>([]);

    // Fetch ข้อมูล Auto Fetch ทุก 5 วินาที
    useEffect(() => {
        const fetchNumbers = async () => {
            try {
                const response = await client.models.NumberEntry.list();
                setNumbers(response.data || []);
            } catch (error) {
                console.error('Error fetching numbers:', error);
            }
        };

        fetchNumbers();
        const interval = setInterval(fetchNumbers, 5000);
        return () => clearInterval(interval); // Cleanup interval
    }, []);

    // ฟังก์ชันจับคู่ Random Pairing
    const handleRandomPair = async () => {
        if (numbers.length < 2) {
            alert('ต้องมีตัวเลขอย่างน้อย 2 ตัวเพื่อจับคู่!');
            return;
        }

        const shuffled = [...numbers].sort(() => Math.random() - 0.5);
        const newPairs: number[][] = [];

        for (let i = 0; i < shuffled.length; i += 2) {
            if (shuffled[i + 1]) {
                newPairs.push([parseInt(shuffled[i].number), parseInt(shuffled[i + 1].number)]);
            }
        }

        try {
            await client.models.RandomStatus.update({
                id: 'random-status-id',
                status: true,
            });

            const oldRecords = await client.models.RandomNumber.list();
            for (const record of oldRecords.data) {
                await client.models.RandomNumber.delete({ id: record.id });
            }

            for (const pair of newPairs) {
                await client.models.RandomNumber.create({ randomNumbers: pair });
            }

            setPairs(newPairs);
            setStage('pairing');
        } catch (error) {
            console.error('Error during pairing:', error);
            alert('เกิดข้อผิดพลาดในการจับคู่!');
        }
    };

    return (
        <div className="dashboard-container">
            {stage === 'default' && (
                <>
                    <div className="dashboard-content">
                        {numbers.length > 0 && (
                            <button className="btn btn-primary start-pairing-btn" onClick={handleRandomPair}>
                                เริ่มจับคู่!
                            </button>
                        )}
                        {numbers.length === 0 ? (
                            <div className="qr-code-large">
                                <QRCodeSVG
                                    value="https://main.d2jvswih7notwz.amplifyapp.com/"
                                    size={600}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    level="Q"
                                />
                            </div>
                        ) : (
                            <div className="dashboard-with-data">
                                <div className="qr-code-small">
                                    <QRCodeSVG
                                        value="https://main.d2jvswih7notwz.amplifyapp.com/"
                                        size={300}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        level="Q"
                                    />
                                </div>
                                <div className="number-list">
                                    {numbers.map((num) => (
                                        <div key={num.id} className="number-item">
                                            {num.number}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {stage === 'pairing' && (
                <div className="pairing-container">
                    <h1>ผลลัพธ์การจับคู่</h1>
                    {pairs.length > 0 ? (
                        <ul className="pairing-result">
                            {pairs.map((pair, index) => (
                                <li key={index}>
                                    {pair[0]} จับคู่กับ {pair[1]}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>ไม่มีข้อมูลการจับคู่</p>
                    )}
                    <button className="btn btn-secondary mt-4" onClick={() => setStage('default')}>
                        กลับไปหน้า Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}
