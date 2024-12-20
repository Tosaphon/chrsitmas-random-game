import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import './NumberInputApp.css'; // Import CSS สำหรับการจัดการ UI

const client = generateClient<Schema>();

export default function NumberInputApp() {
  const [myNumber, setMyNumber] = useState<string | null>(null);
  const [pairedNumber, setPairedNumber] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>(''); // สำหรับกรอกเลขใหม่

  // ดึงหมายเลขของฉันจาก LocalStorage
  useEffect(() => {
    const savedNumber = localStorage.getItem('myNumber');
    if (savedNumber) {
      setMyNumber(savedNumber);
      const checkResetStatus = async () => {
        try {
          const existingNumbers = await client.models.NumberEntry.list();
          var isNotMatch = true
          existingNumbers.data.forEach((entry) => {
            console.log("savedNumber: ", savedNumber)
            console.log("entry.number: ", entry.number)
            if (entry.number === savedNumber) {
              isNotMatch = false
            }
          });
          console.log("isNotMatch: ", isNotMatch)
          if (isNotMatch) {
            // Clear Session และกลับไปหน้า Input
            localStorage.removeItem('myNumber');
            setMyNumber(null);
            setPairedNumber(null);
            setIsFetching(false);
          }
        } catch (error) {
          console.error('Error checking reset status:', error);
        }
      };

      checkResetStatus()
    }
  }, []);

  // ตรวจสอบสถานะการจับคู่
  useEffect(() => {
    if (!myNumber) return;

    const fetchPairingStatus = async () => {
      try {
        const statusResponse = await client.models.RandomStatus.list();
        const activeStatus = statusResponse.data.find((status) => status.status === true);
        if (!activeStatus) {
          setPairedNumber(null);
          return;
        }

        const randomNumbersResponse = await client.models.RandomNumber.list();
        const allPairs = randomNumbersResponse.data;

        for (const pair of allPairs) {
          if (pair.randomNumbers.includes(parseInt(myNumber))) {
            const paired = pair.randomNumbers.find((num) => num !== parseInt(myNumber));
            setPairedNumber(paired?.toString() || null);
            return;
          }
        }

        setPairedNumber(null);
      } catch (error) {
        console.error('Error fetching pairing status:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchPairingStatus();
    const interval = setInterval(fetchPairingStatus, 5000);
    return () => clearInterval(interval);
  }, [myNumber]);

  // ฟังก์ชันเพิ่มหมายเลขของฉัน
  const handleAddNumber = async () => {
    const numValue = Number(inputValue)
    if (!inputValue || isNaN(numValue) || numValue < 0 || numValue > 200) {
      alert('กรุณากรอกหมายเลขที่ถูกต้อง!');
      return;
    }

    try {
      // ตรวจสอบว่าเลขซ้ำหรือไม่
      const existingNumbers = await client.models.NumberEntry.list();
      const isDuplicate = existingNumbers.data.some((entry) => entry.number === inputValue);

      if (isDuplicate) {
        alert('หมายเลขนี้มีอยู่ในระบบแล้ว!');
        return;
      }
      const numInput = "" + parseInt(inputValue)
      console.log("number: ", numInput)
      // บันทึกหมายเลขใหม่
      await client.models.NumberEntry.create({ number: numInput });
      localStorage.setItem('myNumber', numInput); // บันทึกลง LocalStorage
      setMyNumber(numInput); // อัปเดต state
      setInputValue(''); // ล้างค่า input
    } catch (error) {
      console.error('Error adding number:', error);
      alert('เกิดข้อผิดพลาดในการเพิ่มหมายเลข กรุณาลองอีกครั้ง!');
    }
  };

  // ฟังก์ชันลบหมายเลขของฉัน
  const removeMyNumber = async () => {
    if (!myNumber) return;

    const confirmDelete = window.confirm("คุณต้องการลบหมายเลขของคุณจริงหรือไม่?");
    if (!confirmDelete) return;

    try {
      const existingNumbers = await client.models.NumberEntry.list();
      const myEntry = existingNumbers.data.find((entry) => entry.number === myNumber);

      if (myEntry) {
        await client.models.NumberEntry.delete({ id: myEntry.id });
        localStorage.removeItem('myNumber');
        setMyNumber(null);
        setPairedNumber(null);
        alert("หมายเลขของคุณถูกลบเรียบร้อยแล้ว!");
      } else {
        alert("ไม่พบหมายเลขของคุณในฐานข้อมูล!");
      }
    } catch (error) {
      console.error('Error removing my number:', error);
      alert("เกิดข้อผิดพลาดในการลบหมายเลขของคุณ กรุณาลองอีกครั้ง!");
    }
  };

  const handleInput = (e: string) => {
    const numericValue = e.replace(/[^0-9]/g, '');
    setInputValue(numericValue)
  };

  return (
    <div className="input-app-container">
      {!myNumber ? (
        <div className="number-input-section">
          <h1>กรุณากรอกหมายเลขของคุณ</h1>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="กรุณาใส่ตัวเลข"
            className="number-input"
          />
          <button onClick={handleAddNumber} className="btn btn-primary">
            ยืนยันหมายเลข
          </button>
        </div>
      ) : isFetching ? (
        <p>Loading...</p>
      ) : pairedNumber ? (
        <div className="number-display-section">
          <h1 style={{ marginBottom: 100 }}>ผลลัพธ์การจับคู่</h1>
          <p className="normal-number">หมายเลขของคุณคือ</p>
          <p className="big2-number">
            <strong>{myNumber}</strong>
          </p>
          <p className="normal-number">คู่ของคุณคือ </p>
          <p className="big2-number">
            {
              pairedNumber == "-99"
                ? <strong>ได้การ์ดพิเศษ!!</strong>
                : <strong>{pairedNumber}</strong>
            }
          </p>
        </div>
      ) : (
        <div className="number-display-section">
          <h1>หมายเลขของคุณคือ</h1>
          <p className="big-number">{myNumber}</p>
          <p>รอการจับคู่...</p>
          <button onClick={removeMyNumber} className="btn btn-danger">
            ลบหมายเลขของฉัน
          </button>
        </div>
      )}
    </div>
  );
}
