//
//  RNEditorProxy.m
//  RNEditorWebView
//
//  Created by 黄祺 on 2017/2/13.
//
//

#import "RNEditorProxy.h"


@interface RNEditorProxyProtocol : NSURLProtocol

@end

@implementation RNEditorProxyProtocol {
    NSMutableURLRequest* _correctedRequest;
}

+ (BOOL)canInitWithRequest:(NSURLRequest *)request {
    return YES;
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request {
    return request;
}

+ (BOOL)requestIsCacheEquivalent:(NSURLRequest *)a toRequest:(NSURLRequest *)b {
    return NO;
}

- (instancetype)initWithRequest:(NSURLRequest *)request cachedResponse:(NSCachedURLResponse *)cachedResponse client:(id<NSURLProtocolClient>)client {
    if (self = [super initWithRequest:request cachedResponse:cachedResponse client:client]) {
        _correctedRequest = request.mutableCopy;
    }
    return self;
}

- (void)startLoading {
    
}

- (void)stopLoading {
    _correctedRequest = nil;
}

@end


@implementation RNEditorProxy

+ (void)initialize {
    [NSURLProtocol registerClass:[RNEditorProxyProtocol class]];
}

@end
