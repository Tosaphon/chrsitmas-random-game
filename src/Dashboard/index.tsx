import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { QRCodeSVG } from 'qrcode.react';
import './styles.css';

const client = generateClient<Schema>();

export default function Dashboard() {
    const [numbers, setNumbers] = useState<{ id: string; number: string | null }[]>([]);
    const [stage, setStage] = useState<'default' | 'pairing'>('default');
    const [pairs, setPairs] = useState<number[][]>([]);

    // Auto Fetch ข้อมูลทุก 5 วินาที
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch หมายเลขทั้งหมด
                const numberResponse = await client.models.NumberEntry.list();
                setNumbers(numberResponse.data || []);

                // Fetch ข้อมูล Pairing
                const pairResponse = await client.models.RandomNumber.list();
                if (pairResponse.data.length > 0) {
                    const pairsData = pairResponse.data.map((pair) =>
                        pair.randomNumbers.filter((num): num is number => num !== null) // กรอง null ออก
                    );
                    setPairs(pairsData);
                    setStage('pairing'); // เปลี่ยนเป็น Stage Pairing
                } else {
                    setStage('default'); // เปลี่ยนเป็น Stage Default
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
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
                newPairs.push([parseInt(shuffled[i].number ?? ""), parseInt(shuffled[i + 1].number ?? "")]);
            }
        }

        try {
            // Update RandomStatus (Record เดียว)
            const statusResponse = await client.models.RandomStatus.list();
            if (statusResponse.data.length > 0) {
                await client.models.RandomStatus.update({
                    id: statusResponse.data[0].id,
                    status: true,
                });
            } else {
                await client.models.RandomStatus.create({ status: true });
            }

            // ลบข้อมูลเก่าใน RandomNumber
            const oldRecords = await client.models.RandomNumber.list();
            for (const record of oldRecords.data) {
                await client.models.RandomNumber.delete({ id: record.id });
            }

            // เพิ่มข้อมูลใหม่ใน RandomNumber
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
                    <div className="pairing-grid">
                        {pairs.map((pair, index) => (
                            <div key={index} className="pair-item">
                                <div className="pair-number">{pair[0]}</div>
                                <span>จับคู่กับ</span>
                                <div className="pair-number">{pair[1]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
