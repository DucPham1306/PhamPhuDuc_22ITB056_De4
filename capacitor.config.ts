import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'my-app',
  webDir: 'build' ,
  plugins: {
    Camera: {
      cameraPermissionDescription: "Ứng dụng cần quyền truy cập camera để chụp ảnh.",
      photosPermissionDescription: "Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh."
    },
    Filesystem: {
      androidPermissions: [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    LocalNotifications: {
      smallIcon: "ic_launcher"
    },
    Share: {
      shareTitle: "Chia sẻ ảnh",
      dialogTitle: "Chia sẻ ảnh qua..."
    }
    
  }
};

export default config;
