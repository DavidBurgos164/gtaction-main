const { clientCircuitBreakerManager } = require('./jobs/electrician/CircuitBreaker/CircuitBreaker.manager');
mp.events.add({
  CircuitBreakerStart: clientCircuitBreakerManager.start.bind(clientCircuitBreakerManager),
  render: clientCircuitBreakerManager.handleRender.bind(clientCircuitBreakerManager)
});
