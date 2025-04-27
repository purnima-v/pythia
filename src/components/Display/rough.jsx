function LogoutButton() {
    const { logout } = useLogout({
      onSuccess: () => {
        console.log('User successfully logged out');
        // Redirect to landing page or perform other post-logout actions
      },
      onError: (error) => {
        console.error('Logout failed', error);
      }
    });
  
    return <button onClick={logout}>Log out</button>;
  }