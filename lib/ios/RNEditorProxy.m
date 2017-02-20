//
//  RNEditorProxy.m
//  RNEditorWebView
//
//  Created by 黄祺 on 2017/2/13.
//
//

#import "RNEditorProxy.h"
#import <React/RCTImageLoader.h>

static RCTBridge* _bridge;

@interface RNEditorProxyResponse : NSObject<NSURLConnectionDataDelegate>

@end

@implementation RNEditorProxyResponse {
    NSURLRequest* _request;
    NSURLProtocol* _protocol;
    NSMutableDictionary* _headers;
    NSURLCacheStoragePolicy _cachePolicy;
    BOOL _stopped;
}

- (void) _stopLoading {
    _stopped = YES;
}

- (instancetype)initWithRequest:(NSURLRequest *)request protocol:(NSURLProtocol *)protocol {
    if(self = [super init]) {
        _request = request;
        _protocol = protocol;
        _headers = [NSMutableDictionary dictionary];
        _cachePolicy = NSURLCacheStorageNotAllowed;
    }
    return self;
}

- (void)respondWithData:(NSData *)data mimeType:(NSString *)mimeType statusCode:(NSInteger)statusCode {
    if (_stopped) { return; }
    if (!_headers[@"Content-Type"]) {
        if (!mimeType) {
            mimeType = [self _mimeTypeOf:_protocol.request.URL.pathExtension];
        }
        if (mimeType) {
            _headers[@"Content-Type"] = mimeType;
        }
    }
    if (!_headers[@"Content-Length"]) {
        _headers[@"Content-Length"] = [NSString stringWithFormat:@"%lu", (unsigned long)data.length];
    }
    NSHTTPURLResponse* response = [[NSHTTPURLResponse alloc] initWithURL:_protocol.request.URL statusCode:statusCode HTTPVersion:@"HTTP/1.1" headerFields:_headers];
    [_protocol.client URLProtocol:_protocol didReceiveResponse:response cacheStoragePolicy:_cachePolicy];
    [_protocol.client URLProtocol:_protocol didLoadData:data];
    [_protocol.client URLProtocolDidFinishLoading:_protocol];
}

- (NSString*) _mimeTypeOf:(NSString*)pathExtension {
    static NSDictionary* mimeTypes = nil;
    if (mimeTypes == nil) {
        mimeTypes = @{
                      @"png": @"image/png",
                      @"jpg": @"image/jpg",
                      @"jpeg": @"image/jpg",
                      @"woff": @"font/woff",
                      @"ttf": @"font/opentype",
                      @"m4a": @"audio/mp4a-latm",
                      @"js": @"application/javascript; charset=utf-8",
                      @"html": @"text/html; charset=utf-8"
                      };
    }
    return mimeTypes[pathExtension];
}

@end


@interface RNEditorProxyProtocol : NSURLProtocol

@property (strong,nonatomic) RNEditorProxyResponse* proxyResponse;

@end

@implementation RNEditorProxyProtocol {
    NSMutableURLRequest* _correctedRequest;
}

+ (BOOL)canInitWithRequest:(NSURLRequest *)request {
    // TODO: check if from RNEditor, check if loop, check if assets
    // assets-library://
    if ([request.URL.absoluteString hasPrefix:@"assets-library://"]) {
        NSLog(request.URL.absoluteString);
        return YES;
    }
    return NO;
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
        
        self.proxyResponse = [[RNEditorProxyResponse alloc] initWithRequest:request protocol:self];
    }
    return self;
}

- (void)startLoading {
    // TODO: proxy
    [_bridge.imageLoader loadImageWithURLRequest:_correctedRequest callback:^(NSError *error, UIImage *image) {
        NSData* imageData = UIImagePNGRepresentation(image);
        [self.proxyResponse respondWithData:imageData mimeType:@"image/png" statusCode:200];
    }];
}

- (void)stopLoading {
    _correctedRequest = nil;
    [self.proxyResponse _stopLoading];
    self.proxyResponse = nil;
}

@end


@implementation RNEditorProxy

+ (void)initializeWithBridge:(RCTBridge *)bridge {
    _bridge = bridge;
    [NSURLProtocol registerClass:[RNEditorProxyProtocol class]];
}

@end
