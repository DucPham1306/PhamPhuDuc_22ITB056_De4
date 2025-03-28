import React, { useState, useEffect } from 'react';
import './App.css';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

function App() {
  useEffect(() => {
    document.title = "Show Time";
  }, []);

  const [time, setTime] = useState(null);
  const [notification, setNotification] = useState('');

  const getCurrentTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    setTime(formattedTime);
    showNotification(formattedTime);
  };

  const showNotification = async (currentTime) => {
    setNotification(`🕰 Bây giờ là ${currentTime}`);

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification('');
    }, 3000);

    try {
      const permStatus = await LocalNotifications.requestPermissions();
      if (permStatus.display === 'granted') {
        await LocalNotifications.schedule({
          notifications: [
            {
              title: '⏰ Thời gian hiện tại',
              body: `Bây giờ là ${currentTime}`,
              id: new Date().getTime(),
              schedule: { at: new Date(Date.now() + 1000) },
            },
          ],
        });
      } else {
        console.warn('Quyền thông báo bị từ chối!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi thông báo:', error);
    }
  };

  const shareCurrentTime = async () => {
    if (!time) {
      alert("Vui lòng cập nhật thời gian trước!");
      return;
    }

    try {
      await Share.share({
        title: "🕰 Chia sẻ thời gian",
        text: `Thời gian hiện tại là ${time}`,
        dialogTitle: "Chia sẻ thời gian",
      });
    } catch (error) {
      console.error("Lỗi khi chia sẻ:", error);
    }
  };

  const captureScreenshot = async () => {
    const captureArea = document.getElementById("capture-area");
    if (!captureArea) {
      alert("Không tìm thấy nội dung để chụp màn hình!");
      return;
    }
  
    try {
      const canvas = await html2canvas(captureArea);
      const imageData = canvas.toDataURL("image/png");
      const base64Data = imageData.split(',')[1];
  
      if (Capacitor.getPlatform() === 'android') {
        const fileName = `screenshot_${new Date().getTime()}.png`;
  
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
          encoding: Encoding.Base64,
        });
  
        alert("Ảnh đã lưu vào thư viện!");
  
        await Share.share({
          title: "🖼 Ảnh chụp màn hình",
          text: "Đây là ảnh chụp màn hình thời gian hiện tại!",
          url: `file://${fileName}`,
          dialogTitle: "Chia sẻ ảnh",
        });
  
      } else {
        const link = document.createElement("a");
        link.href = imageData;
        link.download = "screenshot.png";
        link.click();
      }
    } catch (error) {
      console.error("Lỗi khi chụp màn hình:", error);
    }
  };

  return (
    <div className="app-container">
      {notification && (
        <div className="custom-notification">
          {notification}
        </div>
      )}

      <header className="app-header">
        <h1>Hiển thị thời gian</h1>
      </header>

      <main className="app-content">
        <div className="age-calculator-container">
          <button className="calculate-button" onClick={getCurrentTime}>
            Cập nhật thời gian
          </button>
          {time && (
            <div id="capture-area" className="result-card" style={{ textAlign: 'center' }}>
              <div className="result-header">
                Thời gian hiện tại
              </div>
              <div className="result-content">
                <p className="age-value" style={{ fontSize: '2rem' }}>{time}</p>
              </div>
            </div>
          )}

          {time && (
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="share-button" onClick={shareCurrentTime}>
                📤 Chia sẻ thời gian
              </button>
              <button className="calculate-button" onClick={captureScreenshot}>
                📷 Chụp màn hình
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2025 PhamPhuDuc - 22ITB056</p>
      </footer>
    </div>
  );
}

export default App;
