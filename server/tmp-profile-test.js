const register = async () => {
  const res = await fetch('http://localhost:1337/api/auth/local/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'testuser', email: 'testuser+copilot@example.com', password: 'TestPass123!' }),
  });
  const json = await res.json();
  console.log('register status', res.status);
  console.log(JSON.stringify(json));
  return { res, json };
};

const updateProfile = async (token) => {
  const res = await fetch('http://localhost:1337/api/profile/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ age: 25, weight: 70, goal: 'maintain', dailyCalorieIntake: 2200, dailyCalorieBurn: 400 }),
  });
  const json = await res.json();
  console.log('update status', res.status);
  console.log(JSON.stringify(json));
  return { res, json };
};

const main = async () => {
  try {
    const { res, json } = await register();
    if (!res.ok) {
      console.error('register failed');
      process.exit(1);
    }
    await updateProfile(json.jwt);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
