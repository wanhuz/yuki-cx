type ABStatus = {
  success: boolean;
  status: {
    site?: { status: number };
    tracker?: { status: number };
  };
};