//
//  RNEditorProxy.h
//  RNEditorWebView
//
//  Created by 黄祺 on 2017/2/13.
//
//

#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>


@interface RNEditorProxy : NSObject

+ (void)initializeWithBridge:(RCTBridge *)bridge;

@end
