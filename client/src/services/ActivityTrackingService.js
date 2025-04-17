// client/src/services/ActivityTrackingService.js
import { throttle, debounce } from 'lodash';

/**
 * Service that tracks VIP buyer activity throughout the application
 * This is a singleton service that should be initialized at the app level
 */
class ActivityTrackingService {
  constructor() {
    this.isInitialized = false;
    this.isTracking = false;
    this.vipBuyerId = null;
    this.auth0UserId = null;
    this.apiEndpoint = `${import.meta.env.VITE_SERVER_URL}/api/buyer/activity`;
    this.pendingEvents = [];
    this.sessionStartTime = null;
    this.lastActivityTime = null;
    this.currentPagePath = null;
    this.pageEntryTime = null;
    this.idleTimeout = null;
    this.isIdle = false;
    this.batchSize = 50; // Increased from 10 - Number of events to batch before sending
    this.flushInterval = 30000; // Flush events every 30 seconds
    this.idleThreshold = 5 * 60 * 1000; // 5 minutes
    this.getToken = null; // Will be set during initialization
    
    // Throttled and debounced handlers for better performance
    this.recordMouseClick = throttle(this._recordMouseClick.bind(this), 300);
    this.recordScroll = throttle(this._recordScroll.bind(this), 1000);
    this.flushEvents = debounce(this._flushEvents.bind(this), 1000, { maxWait: this.flushInterval });
    this.checkIdle = debounce(this._checkIdle.bind(this), 60000);
  }

  /**
   * Initialize the activity tracking service
   * @param {Object} options - Configuration options
   * @param {Function} options.getToken - Function to get the access token
   * @param {string} options.vipBuyerId - VIP buyer ID
   * @param {string} options.auth0UserId - Auth0 user ID
   */
  init({ getToken, vipBuyerId, auth0UserId }) {
    if (this.isInitialized) {
      console.warn('Activity tracking service already initialized');
      return;
    }

    this.getToken = getToken;
    this.vipBuyerId = vipBuyerId;
    this.auth0UserId = auth0UserId;
    this.isInitialized = true;
    
    console.log('Activity tracking service initialized for VIP buyer:', vipBuyerId);
  }

  /**
   * Start tracking user activity
   * Attaches event listeners and starts the tracking process
   */
  startTracking() {
    if (!this.isInitialized) {
      console.error('Activity tracking service not initialized');
      return;
    }

    if (this.isTracking) {
      console.warn('Activity tracking already started');
      return;
    }

    this.isTracking = true;
    this.sessionStartTime = new Date();
    this.lastActivityTime = new Date();
    this.currentPagePath = window.location.pathname;
    this.pageEntryTime = new Date();
    
    // Track global events
    this._attachEventListeners();
    
    // Record session start
    this.recordEvent('session_start', {
      path: this.currentPagePath,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: this.sessionStartTime
    });
    
    // Record page view for initial page
    this.recordPageView();
    
    // Set up a timer to periodically flush events
    this.flushInterval = setInterval(() => this._flushEvents(true), this.flushInterval);

    // Set up idle detection
    this._resetIdleTimeout();
    
    console.log('VIP buyer activity tracking started');
  }

  /**
   * Stop tracking user activity
   * Removes event listeners and stops the tracking process
   */
  stopTracking() {
    if (!this.isTracking) {
      return;
    }

    // Record session end event
    if (this.sessionStartTime) {
      const sessionDuration = Math.round((new Date() - this.sessionStartTime) / 1000);
      this.recordEvent('session_end', {
        duration: sessionDuration,
        path: window.location.pathname
      });
    }

    // Record page exit for the current page
    this._recordPageExit();

    // Remove all event listeners
    this._detachEventListeners();

    // Flush any pending events
    this._flushEvents(true);

    // Clear intervals and timeouts
    clearInterval(this.flushInterval);
    clearTimeout(this.idleTimeout);

    this.isTracking = false;
    this.sessionStartTime = null;
    this.pendingEvents = [];
    console.log('VIP buyer activity tracking stopped');
  }

  /**
   * Record a general event
   * @param {string} eventType - Type of event
   * @param {Object} eventData - Event data
   */
  recordEvent(eventType, eventData = {}) {
    if (!this.isTracking || !this.vipBuyerId) {
      return;
    }

    const event = {
      type: eventType,
      buyerId: this.vipBuyerId,
      auth0UserId: this.auth0UserId,
      timestamp: new Date().toISOString(),
      data: {
        ...eventData,
        url: window.location.href,
        path: window.location.pathname
      }
    };

    this.pendingEvents.push(event);
    this.lastActivityTime = new Date();
    this._resetIdleTimeout();
    
    // If we've reached the batch size, flush the events
    if (this.pendingEvents.length >= this.batchSize) {
      this.flushEvents();
    }
  }

  /**
   * Record a property view event
   * @param {Object} property - Property data
   * @param {string} property.id - Property ID
   * @param {string} property.title - Property title
   * @param {string} [property.address] - Property address
   * @param {string} [property.price] - Property price
   */
  recordPropertyView(property) {
    if (!property || !property.id) {
      console.error('Invalid property data for tracking:', property);
      return;
    }
  
    console.log('Recording property view for:', property.id);
    
    this.recordEvent('property_view', {
      propertyId: property.id,
      propertyTitle: property.title || 'Unknown Property',
      propertyAddress: property.streetAddress ? 
        `${property.streetAddress}, ${property.city || ''}, ${property.state || ''}` : 
        'Address not available',
      price: property.askingPrice || property.price || null,
      entryTime: new Date().toISOString(),
      duration: 0  // Will be updated when the user leaves the page
    });
  }

  /**
   * Record a search event
   * @param {string} query - Search query
   * @param {number} resultsCount - Number of results
   * @param {Object} options - Search options
   * @param {string} [options.type] - Search type ('global', 'area', 'standard')
   * @param {string} [options.area] - Area context for area searches
   * @param {Object} [options.filters] - Search filters
   */
  recordSearch(query, resultsCount, options = {}) {
    this.recordEvent('search', {
      query,
      resultsCount,
      searchType: options.type || 'standard',
      area: options.area || null,
      filters: options.filters || {},
      context: options.context || null
    });
  }

  /**
   * Record an offer submission event
   * @param {Object} offerData - Offer data
   */
  recordOfferSubmission(offerData) {
    this.recordEvent('offer_submission', {
      propertyId: offerData.propertyId,
      offeredPrice: offerData.offeredPrice,
      // Don't include sensitive information
      status: 'submitted'
    });
  }

  /**
   * Record page view when the user navigates to a new page
   * Automatically called on route changes
   */
  recordPageView() {
    // If we were already on a page, record the exit
    if (this.pageEntryTime && this.currentPagePath) {
      this._recordPageExit();
    }

    // Update current page info
    this.currentPagePath = window.location.pathname;
    this.pageEntryTime = new Date();

    this.recordEvent('page_view', {
      path: this.currentPagePath,
      title: document.title,
      referrer: document.referrer || null
    });
  }

  /**
   * Record email interaction event
   * @param {Object} emailData - Email interaction data
   */
  recordEmailInteraction(emailData) {
    this.recordEvent('email_interaction', emailData);
  }

  // Private methods

  /**
   * Record mouse click event
   * @private
   * @param {Event} e - Click event
   */
  _recordMouseClick(e) {
    if (!e.target) return;
    
    // Get meaningful information about the clicked element
    let targetInfo = this._getElementInfo(e.target);
    
    // Don't record clicks on non-interactive or irrelevant elements
    if (!targetInfo.isInteractive && !targetInfo.isContentElement) {
      return;
    }
    
    this.recordEvent('click', {
      elementType: targetInfo.type,
      elementText: targetInfo.text,
      elementId: targetInfo.id,
      elementClass: targetInfo.classes,
      x: e.clientX,
      y: e.clientY
    });
  }

  /**
   * Record scroll event
   * @private
   */
  _recordScroll() {
    const scrollDepth = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    this.recordEvent('scroll', {
      scrollDepth,
      scrollPosition: window.scrollY
    });
  }

  /**
   * Record page exit
   * @private
   */
  _recordPageExit() {
    if (!this.pageEntryTime || !this.currentPagePath) {
      return;
    }

    const now = new Date();
    const duration = Math.round((now - this.pageEntryTime) / 1000);
    
    this.recordEvent('page_exit', {
      path: this.currentPagePath,
      duration
    });

    this.pageEntryTime = null;
  }

  /**
   * Check if the user is idle
   * @private
   */
  _checkIdle() {
    if (!this.lastActivityTime) {
      return;
    }

    const now = new Date();
    const idleTime = now - this.lastActivityTime;
    
    if (idleTime >= this.idleThreshold && !this.isIdle) {
      this.isIdle = true;
      this.recordEvent('user_idle', {
        idleTime: Math.round(idleTime / 1000)
      });
    }
  }

  /**
   * Reset the idle timeout
   * @private
   */
  _resetIdleTimeout() {
    clearTimeout(this.idleTimeout);
    
    // If user was idle, record that they're active again
    if (this.isIdle) {
      this.isIdle = false;
      this.recordEvent('user_active', {
        idleTime: Math.round((new Date() - this.lastActivityTime) / 1000)
      });
    }
    
    this.idleTimeout = setTimeout(() => this._checkIdle(), this.idleThreshold);
  }

  /**
   * Flush pending events to the server
   * @private
   * @param {boolean} force - Force flush even if batch size not reached
   */
  async _flushEvents(force = false) {
    if (!this.pendingEvents.length || (!force && this.pendingEvents.length < this.batchSize)) {
      return;
    }

    try {
      // Get a fresh token for the request
      const token = await this.getToken();
      if (!token) {
        console.error('No token available for sending activity data');
        return;
      }

      // Send all events at once instead of batching into smaller chunks
      const events = [...this.pendingEvents];
      this.pendingEvents = [];

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ events })
      });

      if (!response.ok) {
        throw new Error(`Failed to send activity data: ${response.status}`);
      }

      console.log(`${events.length} activity events sent successfully`);
    } catch (error) {
      console.error('Error sending activity data:', error);
      // Put the events back in the queue to try again later
      this.pendingEvents = [...this.pendingEvents];
    }
  }

  /**
   * Attach event listeners for tracking
   * @private
   */
  _attachEventListeners() {
    // Page visibility change
    document.addEventListener('visibilitychange', this._handleVisibilityChange.bind(this));
    
    // Click tracking
    document.addEventListener('click', this.recordMouseClick);
    
    // Scroll tracking
    window.addEventListener('scroll', this.recordScroll, { passive: true });
    
    // Before unload (page exit)
    window.addEventListener('beforeunload', this._handleBeforeUnload.bind(this));
    
    // User activity tracking for idle detection
    document.addEventListener('mousemove', this._handleUserActivity.bind(this), { passive: true });
    document.addEventListener('keydown', this._handleUserActivity.bind(this), { passive: true });
    document.addEventListener('touchstart', this._handleUserActivity.bind(this), { passive: true });
  }

  /**
   * Detach event listeners
   * @private
   */
  _detachEventListeners() {
    document.removeEventListener('visibilitychange', this._handleVisibilityChange.bind(this));
    document.removeEventListener('click', this.recordMouseClick);
    window.removeEventListener('scroll', this.recordScroll);
    window.removeEventListener('beforeunload', this._handleBeforeUnload.bind(this));
    document.removeEventListener('mousemove', this._handleUserActivity.bind(this));
    document.removeEventListener('keydown', this._handleUserActivity.bind(this));
    document.removeEventListener('touchstart', this._handleUserActivity.bind(this));
  }

  /**
   * Handle page visibility change (tab focus/blur)
   * @private
   * @param {Event} e - Visibility change event
   */
  _handleVisibilityChange(e) {
    if (document.visibilityState === 'hidden') {
      this.recordEvent('tab_blur', {
        path: window.location.pathname
      });
    } else if (document.visibilityState === 'visible') {
      this.recordEvent('tab_focus', {
        path: window.location.pathname
      });
    }
  }

  /**
   * Handle before unload (page exit)
   * @private
   * @param {Event} e - Before unload event
   */
  _handleBeforeUnload(e) {
    this._recordPageExit();
    this._flushEvents(true);
  }

  /**
   * Handle user activity
   * @private
   */
  _handleUserActivity() {
    this.lastActivityTime = new Date();
    this._resetIdleTimeout();
  }

  /**
   * Get information about an element
   * @private
   * @param {HTMLElement} element - DOM element
   * @returns {Object} Element information
   */
  _getElementInfo(element) {
    // Start with the actual element
    let target = element;
    
    // If the element is not interesting, try to find a parent that is
    if (!this._isInteractiveElement(target) && !target.id && !target.className) {
      // Try to find a parent button, anchor, or other interactive element
      let parent = target.parentElement;
      while (parent && !this._isInteractiveElement(parent) && !parent.id) {
        parent = parent.parentElement;
      }
      
      // If we found a better parent, use that instead
      if (parent && (this._isInteractiveElement(parent) || parent.id)) {
        target = parent;
      }
    }
    
    // Get the text content, limited to a reasonable length
    let text = '';
    if (target.tagName === 'INPUT' && target.type !== 'password') {
      text = target.placeholder || target.type;
    } else if (target.tagName === 'IMG' && target.alt) {
      text = target.alt;
    } else {
      text = (target.innerText || target.textContent || '')
        .replace(/\\s+/g, ' ')
        .trim()
        .substring(0, 50);
    }

    // If there's no text but there's a title attribute, use that
    if ((!text || text.length === 0) && target.getAttribute('title')) {
      text = target.getAttribute('title');
    }
    
    // If there's an aria-label, that might be more descriptive
    if (target.getAttribute('aria-label')) {
      text = target.getAttribute('aria-label');
    }
    
    // For links, include the href (but not if it's a complex object)
    let href = '';
    if (target.tagName === 'A' && target.href && typeof target.href === 'string') {
      try {
        const url = new URL(target.href);
        href = url.pathname;
      } catch {
        href = target.href;
      }
    }

    return {
      type: target.tagName.toLowerCase(),
      id: target.id || '',
      classes: Array.from(target.classList || []).join(' '),
      text: text || href || target.tagName.toLowerCase(),
      href,
      isInteractive: this._isInteractiveElement(target),
      isContentElement: this._isContentElement(target)
    };
  }

  /**
   * Check if an element is interactive
   * @private
   * @param {HTMLElement} el - DOM element
   * @returns {boolean} Whether the element is interactive
   */
  _isInteractiveElement(el) {
    if (!el || !el.tagName) return false;
    
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    
    // Direct interactive elements
    const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'summary', 'details'];
    if (interactiveTags.includes(tag)) return true;
    
    // Elements with interactive roles
    const interactiveRoles = [
      'button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox',
      'menuitemradio', 'option', 'radio', 'searchbox', 'switch', 'tab'
    ];
    if (role && interactiveRoles.includes(role)) return true;
    
    // Check for click handlers
    if (el.onclick || el.getAttribute('onClick')) return true;
    
    // Check for common interactive attributes
    return el.hasAttribute('tabindex') || 
           el.getAttribute('aria-haspopup') === 'true' ||
           el.getAttribute('aria-expanded') !== null;
  }

  /**
   * Check if an element is a content element
   * @private
   * @param {HTMLElement} el - DOM element
   * @returns {boolean} Whether the element is a content element
   */
  _isContentElement(el) {
    if (!el || !el.tagName) return false;
    
    const tag = el.tagName.toLowerCase();
    const contentTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'article', 'section'];
    
    return contentTags.includes(tag);
  }
}

// Create a singleton instance
const activityTrackingService = new ActivityTrackingService();

export default activityTrackingService;