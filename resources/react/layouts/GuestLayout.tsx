export default function GuestLayout(props) {

  return <>
    <div className="min-h-screen bg-gray-100">
      {props.children}
    </div>
  </>
}
