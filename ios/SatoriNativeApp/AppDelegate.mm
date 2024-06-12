#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <AVFoundation/AVFoundation.h>
#import <MediaPlayer/MediaPlayer.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  // Set up AVAudioSession for background audio
  NSError *setCategoryError = nil;
  BOOL success = [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:&setCategoryError];
  if (!success) {
    NSLog(@"Error setting AVAudioSession category: %@", setCategoryError);
  }

  NSError *activationError = nil;
  success = [[AVAudioSession sharedInstance] setActive:YES error:&activationError];
  if (!success) {
    NSLog(@"Error activating AVAudioSession: %@", activationError);
  }

  // Set up MPRemoteCommandCenter for custom intervals
  MPRemoteCommandCenter *commandCenter = [MPRemoteCommandCenter sharedCommandCenter];

  commandCenter.skipForwardCommand.preferredIntervals = @[@10]; // Set custom skip forward interval to 10 seconds
  [commandCenter.skipForwardCommand setEnabled:YES];
  [commandCenter.skipForwardCommand addTarget:self action:@selector(handleSkipForwardEvent:)];

  commandCenter.skipBackwardCommand.preferredIntervals = @[@10]; // Set custom skip backward interval to 10 seconds
  [commandCenter.skipBackwardCommand setEnabled:YES];
  [commandCenter.skipBackwardCommand addTarget:self action:@selector(handleSkipBackwardEvent:)];

  // Initialize React Native
  NSURL *jsCodeLocation = [self sourceURLForBridge:nil]; // Retrieve the JS bundle URL
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"SatoriNativeApp"
                                               initialProperties:@{}
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1.0];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Handle skip forward command
- (MPRemoteCommandHandlerStatus)handleSkipForwardEvent:(MPRemoteCommandEvent *)event {
  [[NSNotificationCenter defaultCenter] postNotificationName:@"SkipForwardEvent" object:nil];
  return MPRemoteCommandHandlerStatusSuccess;
}

// Handle skip backward command
- (MPRemoteCommandHandlerStatus)handleSkipBackwardEvent:(MPRemoteCommandEvent *)event {
  [[NSNotificationCenter defaultCenter] postNotificationName:@"SkipBackwardEvent" object:nil];
  return MPRemoteCommandHandlerStatusSuccess;
}

@end
