const ws = new WebSocket('ws://localhost:3000/');
ws.onmessage = message => {
  let data;
  try {
    data = JSON.parse(message.data);
  } catch (e) {
    console.error(e);
    return;
  }
  const topic = data['topic'];
  switch (topic) {
    case 'welcome':
      document.getElementById('connecting').style.display = 'none';
      document.getElementById('done').style.display = '';
      break;
    default:
      console.log(`Unrecognized topic: ${topic}`);
  }
};
