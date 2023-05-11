export default function GuestLayout(props) {

  return <>
    <div className="min-h-screen bg-slate-100">
      {props.children}
    </div>
  </>
}
