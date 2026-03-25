import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem' }}>😿</p>
          <p style={{ fontWeight: 700 }}>Что-то пошло не так</p>
          <p style={{ color: '#888', fontSize: '13px' }}>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: '16px', padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#f06292', color: '#fff', cursor: 'pointer' }}
          >
            Попробовать ещё раз
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
