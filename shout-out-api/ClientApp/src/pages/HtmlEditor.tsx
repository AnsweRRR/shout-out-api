export default function HtmlEditor() {
    return (
        <div style={{
            display: 'table',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            backgroundColor: '#212B36'
        }}>
            <div style={{
                display: 'table-cell',
                verticalAlign: 'middle',
            }}>
                <div
                    style={{
                        maxWidth: '50%',
                        margin: '0 auto'
                    }}
                >
                    <img
                        src="https://cdn.pixabay.com/photo/2018/03/27/15/05/logo-3266214_960_720.png"
                        alt="ShoutOut-with-text-logo"
                        style={{ height: '100px' }}
                    />
                </div>

                <div style={{
                    maxWidth: '50%',
                    backgroundColor: '#FFFFFF',
                    color: '#212B36',
                    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    backgroundImage: 'none',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.12)',
                    borderRadius: '16px',
                    zIndex: 0,
                    padding: '24px',
                    marginBottom: '24px',
                    margin: '0 auto'
                }}>
                    <h1>You have forgotten your password</h1>
                    <h4>If you did not requested the new password then please do not pay attention to this eam.</h4>
                    <img src="https://m.media-amazon.com/images/I/81ADRpAX19L._AC_UF1000,1000_QL80_.jpg" alt="item-logo" style={{ height: '100px', margin: 'auto' }} />
                </div>

                <div
                    style={{
                        maxWidth: '50%',
                        margin: '0 auto'
                    }}
                >
                    <img
                        src="https://cdn.pixabay.com/photo/2018/03/27/15/05/logo-3266214_960_720.png"
                        alt="ShoutOut-logo"
                        style={{
                            height: '100px',
                            float: 'right'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
