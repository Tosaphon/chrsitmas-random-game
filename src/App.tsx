import React, { useState } from 'react';
import type { Schema } from '../amplify/data/resource'; // Import Schema จาก resource.ts
import { generateClient } from 'aws-amplify/data'; // ใช้ generateClient เพื่อสร้าง client

const client = generateClient<Schema>();

export default function NumberInputApp() {
  const [displayNumber, setDisplayNumber] = useState<string | null>(null);

  const addNumber = async () => {
    const input = window.prompt("Enter a number:");
    if (!input || isNaN(Number(input))) {
      alert("Please enter a valid number!");
      return;
    }

    // const number = parseInt(input, 10);
    // const stringNumber = client.models.NumberEntry.get({ id: input })
      console.log(input)

    try {
      await client.models.NumberEntry.create({
        input
      });

      // แสดงหมายเลข
      setDisplayNumber(input);
    } catch (error) {
      console.error("Error creating number:", error);
      alert("Failed to save number. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Number Input App</h1>
      <button onClick={addNumber}>Add Number</button>
      {displayNumber !== null && (
        <div style={{ fontSize: '5rem', fontWeight: 'bold', marginTop: '2rem' }}>
          {displayNumber}
        </div>
      )}
    </div>
  );
}
