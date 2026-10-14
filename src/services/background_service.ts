import notifee, { AndroidImportance } from '@notifee/react-native';

let channelId: string | null = null;
let running = false;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function startBackgroundService() {
  if (running) return;
  running = true;

  // Create the notification channel (idempotent)
  if (!channelId) {
    channelId = await notifee.createChannel({
      id: 'cts-connection',
      name: 'CTS Connection',
      importance: AndroidImportance.LOW,
    });
  }

  // Register the foreground service task.
  // The loop keeps JS alive; the socket's own handlers do the work.
  notifee.registerForegroundService(() => {
    return new Promise<void>(async (resolve) => {
      while (running) {
        await sleep(1000);
      }
      resolve();
    });
  });

  // Start the foreground service with a persistent notification
  await notifee.displayNotification({
    title: 'CTS is connected',
    body: 'Keeping your session active',
    android: {
      channelId,
      asForegroundService: true,
      ongoing: true,
      color: '#2f7dd1',
      pressAction: { id: 'default' },
    },
  });
}

export async function stopBackgroundService() {
  if (!running) return;
  running = false;
  try {
    await notifee.stopForegroundService();
  } catch {}
}