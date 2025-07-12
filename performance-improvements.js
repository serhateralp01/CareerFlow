// CareerFlow Performance Improvements
// Based on test results and analysis

console.log('🚀 Implementing CareerFlow Performance Improvements');

// 1. Lazy Loading for External Dependencies
const LazyLoader = {
    loadedScripts: new Set(),
    
    async loadScript(src, id) {
        if (this.loadedScripts.has(id)) {
            return Promise.resolve();
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.id = id;
            script.onload = () => {
                this.loadedScripts.add(id);
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },
    
    async loadCSS(href, id) {
        if (this.loadedScripts.has(id)) {
            return Promise.resolve();
        }
        
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.id = id;
            link.onload = () => {
                this.loadedScripts.add(id);
                resolve();
            };
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
};

// 2. Performance Monitoring
const PerformanceMonitor = {
    marks: new Map(),
    
    mark(name) {
        const timestamp = performance.now();
        this.marks.set(name, timestamp);
        console.log(`[Performance] Mark: ${name} at ${timestamp.toFixed(2)}ms`);
    },
    
    measure(name, startMark, endMark) {
        const startTime = this.marks.get(startMark);
        const endTime = this.marks.get(endMark) || performance.now();
        const duration = endTime - startTime;
        
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        return duration;
    },
    
    measureFunction(fn, name) {
        const startTime = performance.now();
        const result = fn();
        const endTime = performance.now();
        
        console.log(`[Performance] ${name}: ${(endTime - startTime).toFixed(2)}ms`);
        return result;
    }
};

// 3. Memory Usage Monitoring
const MemoryMonitor = {
    log() {
        if (performance.memory) {
            const memory = performance.memory;
            console.log(`[Memory] Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
            console.log(`[Memory] Total: ${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`);
            console.log(`[Memory] Limit: ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`);
        }
    },
    
    startMonitoring(interval = 30000) {
        setInterval(() => {
            this.log();
        }, interval);
    }
};

// 4. Error Tracking and Reporting
const ErrorTracker = {
    errors: [],
    
    track(error, context = '') {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.errors.push(errorInfo);
        console.error('[Error Tracker]', errorInfo);
        
        // Send to analytics service (if available)
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: error.message,
                fatal: false
            });
        }
    },
    
    getErrors() {
        return this.errors;
    },
    
    exportErrors() {
        const blob = new Blob([JSON.stringify(this.errors, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `careerflow-errors-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// 5. Data Optimization
const DataOptimizer = {
    // Debounce function for search inputs
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Memoization for expensive calculations
    memoize(fn) {
        const cache = new Map();
        return function(...args) {
            const key = JSON.stringify(args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = fn.apply(this, args);
            cache.set(key, result);
            return result;
        };
    }
};

// 6. UI Performance Improvements
const UIOptimizer = {
    // Virtual scrolling for large lists
    createVirtualList(container, items, itemHeight, renderItem) {
        const containerHeight = container.clientHeight;
        const visibleItems = Math.ceil(containerHeight / itemHeight);
        const totalHeight = items.length * itemHeight;
        
        let scrollTop = 0;
        let startIndex = 0;
        let endIndex = Math.min(visibleItems, items.length);
        
        const viewport = document.createElement('div');
        viewport.style.height = `${totalHeight}px`;
        viewport.style.position = 'relative';
        
        const render = () => {
            viewport.innerHTML = '';
            
            for (let i = startIndex; i < endIndex; i++) {
                const item = renderItem(items[i], i);
                item.style.position = 'absolute';
                item.style.top = `${i * itemHeight}px`;
                item.style.height = `${itemHeight}px`;
                viewport.appendChild(item);
            }
        };
        
        const handleScroll = () => {
            scrollTop = container.scrollTop;
            startIndex = Math.floor(scrollTop / itemHeight);
            endIndex = Math.min(startIndex + visibleItems + 1, items.length);
            render();
        };
        
        container.addEventListener('scroll', DataOptimizer.throttle(handleScroll, 16));
        container.appendChild(viewport);
        render();
        
        return {
            update: (newItems) => {
                items = newItems;
                render();
            }
        };
    },
    
    // Intersection Observer for lazy loading
    setupLazyLoading(selector, callback) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        document.querySelectorAll(selector).forEach(el => {
            observer.observe(el);
        });
        
        return observer;
    }
};

// 7. Caching Strategy
const CacheManager = {
    cache: new Map(),
    
    set(key, value, ttl = 300000) { // 5 minutes default
        const expiry = Date.now() + ttl;
        this.cache.set(key, { value, expiry });
    },
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    },
    
    clear() {
        this.cache.clear();
    },
    
    size() {
        return this.cache.size;
    }
};

// 8. Initialize Performance Monitoring
function initializePerformanceMonitoring() {
    console.log('🔍 Initializing Performance Monitoring');
    
    // Global error handling
    window.addEventListener('error', (event) => {
        ErrorTracker.track(event.error, 'Global Error');
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        ErrorTracker.track(new Error(event.reason), 'Unhandled Promise Rejection');
    });
    
    // Performance marks
    PerformanceMonitor.mark('app-start');
    
    // Memory monitoring
    MemoryMonitor.startMonitoring();
    
    // Page load metrics
    window.addEventListener('load', () => {
        PerformanceMonitor.mark('page-loaded');
        PerformanceMonitor.measure('Page Load Time', 'app-start', 'page-loaded');
        
        // Log navigation timing
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            console.log(`[Performance] DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
            console.log(`[Performance] Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
        }
    });
    
    // Expose utilities globally
    window.CareerFlowPerformance = {
        LazyLoader,
        PerformanceMonitor,
        MemoryMonitor,
        ErrorTracker,
        DataOptimizer,
        UIOptimizer,
        CacheManager
    };
    
    console.log('✅ Performance monitoring initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePerformanceMonitoring);
} else {
    initializePerformanceMonitoring();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LazyLoader,
        PerformanceMonitor,
        MemoryMonitor,
        ErrorTracker,
        DataOptimizer,
        UIOptimizer,
        CacheManager
    };
} 