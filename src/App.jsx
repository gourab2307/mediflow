import { motion, useReducedMotion } from 'motion/react'

import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  Menu,
  ShieldCheck,
  Stethoscope,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const features = [
  {
    icon: CalendarDays,
    title: 'Smart appointments',
    description:
      'Make scheduling simpler with organized appointments and a clearer view of the day ahead.',
  },
  {
    icon: Users,
    title: 'Patient management',
    description:
      'Keep patient profiles, visit histories, and essential information organized in one place.',
  },
  {
    icon: Stethoscope,
    title: 'Doctor workspace',
    description:
      'Help doctors manage their schedules, review patient visits, and record consultations.',
  },
  {
    icon: BrainCircuit,
    title: 'AI document assistant',
    description:
      'Find relevant information in authorized hospital documents with answers linked to their sources.',
  },
]

function App() {
  const [patients, setPatients] = useState([])
const [loadingPatients, setLoadingPatients] = useState(true)
const [patientError, setPatientError] = useState('')
const [editingPatient, setEditingPatient] = useState(null)
const [formData, setFormData] = useState({
  name: '',
  age: '',
  gender: 'Male',
  phone: '',
})

const [savingPatient, setSavingPatient] = useState(false)
const [formMessage, setFormMessage] = useState('')

async function handleRegisterPatient(event) {
  event.preventDefault()

  setSavingPatient(true)
  setFormMessage('')

  try {
    const response = await fetch('http://localhost:5001/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        age: Number(formData.age),
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to register patient')
    }

    setPatients((currentPatients) => [
      ...currentPatients,
      result.data,
    ])

    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
    })

    setFormMessage('Patient registered successfully!')
  } catch (error) {
    setFormMessage(error.message)
  } finally {
    setSavingPatient(false)
  }
}

async function handleUpdatePatient(event) {
  event.preventDefault()

  try {
    const response = await fetch(
      `http://localhost:5001/api/patients/${editingPatient._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingPatient,
          age: Number(editingPatient.age),
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update patient')
    }

    setPatients((currentPatients) =>
      currentPatients.map((patient) =>
        patient._id === editingPatient._id
          ? result.data
          : patient
      )
    )

    setEditingPatient(null)
    setFormMessage('Patient updated successfully!')
  } catch (error) {
    setFormMessage(error.message)
  }
}

async function handleDeletePatient(patientId) {
  try {
    const response = await fetch(
      `http://localhost:5001/api/patients/${patientId}`,
      {
        method: 'DELETE',
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete patient')
    }

    setPatients((currentPatients) =>
      currentPatients.filter((patient) => patient._id !== patientId)
    )

    if (editingPatient?._id === patientId) {
      setEditingPatient(null)
    }

    setFormMessage('Patient deleted successfully!')
  } catch (error) {
    setFormMessage(error.message)
  }
}


useEffect(() => {
  async function fetchPatients() {
    try {
      const response = await fetch('http://localhost:5001/api/patients')

      if (!response.ok) {
        throw new Error('Failed to fetch patients')
      }

      const result = await response.json()
      setPatients(result.data)
    } catch (error) {
      setPatientError(error.message)
    } finally {
      setLoadingPatients(false)
    }
  }

  fetchPatients()
}, [])
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#home" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
              <HeartPulse size={23} />
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Medi<span className="text-teal-600">Flow</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm font-medium text-slate-600 hover:text-teal-700">Home</a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-teal-700">Features</a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-teal-700">About</a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a href="#get-started" className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Log in
            </a>
            <a href="#get-started" className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
              Get started <ArrowRight className="ml-1 inline" size={16} />
            </a>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="space-y-1 border-t border-slate-100 px-5 py-4 md:hidden">
            <a onClick={() => setMenuOpen(false)} href="#home" className="block rounded-lg px-3 py-2">Home</a>
            <a onClick={() => setMenuOpen(false)} href="#features" className="block rounded-lg px-3 py-2">Features</a>
            <a onClick={() => setMenuOpen(false)} href="#about" className="block rounded-lg px-3 py-2">About</a>
            <a onClick={() => setMenuOpen(false)} href="#get-started" className="block rounded-lg bg-teal-600 px-3 py-2 text-white">Get started</a>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-100/60 blur-3xl" />
          <div className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-cyan-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800">
                <Activity size={16} />
                A smarter way to manage healthcare
              </div>

              <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Better care starts with{' '}
                <span className="text-teal-600">better coordination.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Bring appointments, patient records, and everyday hospital
                workflows together in one thoughtfully designed platform.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a href="#get-started" className="rounded-xl bg-teal-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700">
                  Explore MediFlow <ArrowRight className="ml-2 inline" size={18} />
                </a>
                <a href="#features" className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
                  Discover features
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-600" size={17} /> Organized workflows</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="text-teal-600" size={17} /> Role-based access</span>
              </div>
            </div>
           
{/* Illustrative dashboard preview */}
<motion.div
  className="relative mx-auto w-full max-w-xl"
  initial={false}
  whileHover={{ scale: 1.015 }}
  style={{ perspective: 1000 }}
  onMouseMove={(event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height

    event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - y) * 8}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${(x - 0.5) * 8}deg`)
  }}
  onMouseLeave={(event) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg')
    event.currentTarget.style.setProperty('--tilt-y', '0deg')
  }}
>
  <div className="absolute -inset-4 rounded-[2rem] bg-teal-100/70 blur-2xl" />

  <motion.div
    className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
    style={{
      rotateX: 'var(--tilt-x, 0deg)',
      rotateY: 'var(--tilt-y, 0deg)',
      transformStyle: 'preserve-3d',
      transition: 'transform 150ms ease-out',
    }}
  >
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <HeartPulse size={22} />
        </div>
        <div>
          <p className="font-bold text-slate-900">Hospital overview</p>
          <p className="text-xs text-slate-500">Illustrative dashboard preview</p>
        </div>
      </div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Demo</span>
    </div>

    <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
      <div className="rounded-2xl bg-teal-50 p-4">
        <Users className="mb-3 text-teal-700" size={21} />
        <p className="text-2xl font-bold text-slate-900">
          {loadingPatients ? '...' : patientError ? '—' : patients.length}
        </p>
        <p className="mt-1 text-xs text-slate-500">Patient profiles</p>
      </div>
      <div className="rounded-2xl bg-blue-50 p-4">
        <CalendarDays className="mb-3 text-blue-700" size={21} />
        <p className="text-2xl font-bold text-slate-900">24</p>
        <p className="mt-1 text-xs text-slate-500">Appointments</p>
      </div>
      <div className="col-span-2 rounded-2xl bg-violet-50 p-4 sm:col-span-1">
        <Stethoscope className="mb-3 text-violet-700" size={21} />
        <p className="text-2xl font-bold text-slate-900">12</p>
        <p className="mt-1 text-xs text-slate-500">Doctors</p>
      </div>
    </div>

    <div className="px-5 pb-5">
      <div className="rounded-2xl border border-slate-100 p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-semibold text-slate-900">Upcoming appointments</p>
          <span className="text-xs font-medium text-teal-700">Preview</span>
        </div>

        {[
          { initials: 'AM', name: 'Alex Morgan', detail: 'General consultation', time: '09:30 AM', color: 'bg-sky-100 text-sky-700' },
          { initials: 'JS', name: 'Jordan Smith', detail: 'Follow-up visit', time: '10:15 AM', color: 'bg-amber-100 text-amber-700' },
          { initials: 'RT', name: 'Riley Taylor', detail: 'Routine check-up', time: '11:00 AM', color: 'bg-violet-100 text-violet-700' },
        ].map((patient) => (
          <div key={patient.initials} className="flex items-center gap-3 border-t border-slate-100 py-3 first:border-0">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${patient.color}`}>
              {patient.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{patient.name}</p>
              <p className="text-xs text-slate-500">{patient.detail}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
              <Clock3 size={13} />{patient.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>

  <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
      <ShieldCheck size={22} />
    </span>
    <div>
      <p className="text-sm font-bold text-slate-900">Privacy first</p>
      <p className="text-xs text-slate-500">Designed around access control</p>
    </div>
  </div>
</motion.div>
</div>
</section>  

{/* Patient Records Section */}
<section id="patients" className="py-16 sm:py-20">
  <div className="mx-auto max-w-7xl px-6">
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
        Live Data
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight">
        Patient Records
      </h2>

      <p className="mt-3 text-gray-500">
        Patient information retrieved from the MediFlow database.
      </p>
      {/* Add Patient Form */}
<form
  className="mb-8 rounded-2xl border border-gray-200 bg-white p-6"
  onSubmit={handleRegisterPatient}
>
  <h3 className="mb-5 text-xl font-semibold text-slate-900">
    Register New Patient
  </h3>

  <div className="grid gap-4 sm:grid-cols-2">
    <input
      type="text"
      placeholder="Patient name"
      value={formData.name}
      onChange={(event) =>
        setFormData({ ...formData, name: event.target.value })
      }
      required
      className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
    />

    <input
      type="number"
      placeholder="Age"
      min="0"
      value={formData.age}
      onChange={(event) =>
        setFormData({ ...formData, age: event.target.value })
      }
      required
      className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
    />

    <select
      value={formData.gender}
      onChange={(event) =>
        setFormData({ ...formData, gender: event.target.value })
      }
      className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-teal-600"
    >
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>

    <input
      type="tel"
      placeholder="Phone number"
      value={formData.phone}
      onChange={(event) =>
        setFormData({ ...formData, phone: event.target.value })
      }
      required
      className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
    />
  </div>

  <button
    type="submit"
    disabled={savingPatient}
    className="mt-5 rounded-xl bg-teal-700 px-6 py-3 font-medium text-white transition hover:bg-teal-800"
  >
    {savingPatient ? 'Registering...' : 'Register Patient'}
  </button>
  {formMessage && (
  <p
    className={`mt-4 text-sm font-medium ${
      formMessage.includes('successfully')
        ? 'text-emerald-600'
        : 'text-red-600'
    }`}
  >
    {formMessage}
  </p>
)}
</form>
    </div>

    {loadingPatients ? (
      <p className="text-gray-500">Loading patient records...</p>
    ) : patientError ? (
      <p className="text-red-500">
        Unable to load patients: {patientError}
      </p>
    ) : patients.length === 0 ? (
      <p className="rounded-xl border border-gray-200 p-6 text-gray-500">
        No patient records found. Add a patient through the API to see it here.
      </p>
    ) : (
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        {/* Edit Patient Form */}
{editingPatient && (
  <form
    className="mb-8 rounded-2xl border border-teal-200 bg-white p-6"
    onSubmit={handleUpdatePatient}
  >
    <h3 className="mb-5 text-xl font-semibold text-slate-900">
      Edit Patient Details
    </h3>

    <div className="grid gap-4 sm:grid-cols-2">
      <input
        type="text"
        placeholder="Patient name"
        value={editingPatient.name}
        onChange={(event) =>
          setEditingPatient({
            ...editingPatient,
            name: event.target.value,
          })
        }
        required
        className="rounded-xl border border-gray-300 px-4 py-3"
      />

      <input
        type="number"
        placeholder="Age"
        min="0"
        value={editingPatient.age}
        onChange={(event) =>
          setEditingPatient({
            ...editingPatient,
            age: event.target.value,
          })
        }
        required
        className="rounded-xl border border-gray-300 px-4 py-3"
      />

      <select
        value={editingPatient.gender}
        onChange={(event) =>
          setEditingPatient({
            ...editingPatient,
            gender: event.target.value,
          })
        }
        className="rounded-xl border border-gray-300 bg-white px-4 py-3"
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="tel"
        placeholder="Phone number"
        value={editingPatient.phone}
        onChange={(event) =>
          setEditingPatient({
            ...editingPatient,
            phone: event.target.value,
          })
        }
        required
        className="rounded-xl border border-gray-300 px-4 py-3"
      />
    </div>

    <div className="mt-5 flex gap-3">
      <button
        type="submit"
        className="rounded-xl bg-teal-700 px-6 py-3 font-medium text-white hover:bg-teal-800"
      >
        Save Changes
      </button>

      <button
        type="button"
        onClick={() => setEditingPatient(null)}
        className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
    </div>
  </form>
)}
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Age</th>
              <th className="px-6 py-4 font-semibold">Gender</th>
              <th className="px-6 py-4 font-semibold">Phone</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td className="px-6 py-4 font-medium">
                  {patient.name}
                </td>
                <td className="px-6 py-4">{patient.age}</td>
                <td className="px-6 py-4">{patient.gender}</td>
                <td className="px-6 py-4">{patient.phone}</td>
                
<td className="px-6 py-4">
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => setEditingPatient(patient)}
      className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
    >
      Edit
    </button>

    <button
      type="button"
      onClick={() => {
        const confirmed = window.confirm(
          `Are you sure you want to delete ${patient.name}?`
        )

        if (confirmed) {
          handleDeletePatient(patient._id)
        }
      }}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
    >
      Delete
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</section>


        {/* Feature section */}
        <section id="features" className="border-y border-slate-100 bg-slate-50/70 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Everything in one place</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Less administrative friction. More focus on care.
              </h2>
              <p className="mt-5 leading-7 text-slate-600">
                A unified workspace for the everyday tasks that keep a hospital moving.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <article
  key={feature.title}
  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-teal-300 hover:shadow-2xl hover:shadow-teal-900/10 motion-reduce:transform-none motion-reduce:transition-none"
>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
                      <Icon size={23} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                    <a href="#get-started" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                      Learn more <ChevronRight size={16} />
                    </a>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* About section */}
        <section id="about" className="py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300">
                <BrainCircuit size={28} />
              </div>
              <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-teal-300">Built for better workflows</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Healthcare operations, thoughtfully connected.
              </h2>
              <p className="mt-5 leading-7 text-slate-300">
                MediFlow brings core hospital workflows into a single application, with an AI document assistant designed to help authorized users find information from trusted sources.
              </p>
              <a href="#features" className="mt-8 inline-flex items-center gap-2 font-semibold text-teal-300 hover:text-teal-200">
                Explore the platform <ArrowDownRight size={18} />
              </a>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Designed with clarity in mind</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                The right information, for the right role.
              </h2>
              <p className="mt-5 leading-7 text-slate-600">
                Hospital administrators, doctors, and patients have different needs. MediFlow is being built around role-specific experiences and responsible access to information.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  { icon: ShieldCheck, title: 'Role-based access', detail: 'Keep each workflow focused on the right permissions.' },
                  { icon: Activity, title: 'Connected workflows', detail: 'Bring appointments and patient visits into a coherent experience.' },
                  { icon: BrainCircuit, title: 'AI with sources', detail: 'Make document-based answers easier to review and verify.' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        <Icon size={21} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section id="get-started" className="px-5 pb-20 sm:px-8 sm:pb-24">
  <div className="group relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-teal-700 px-6 py-14 text-center text-white shadow-xl shadow-teal-900/10 sm:px-12 sm:py-16">
    <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-500/30 blur-3xl transition-transform duration-700 group-hover:scale-125" />
    <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

    <div className="relative">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-teal-600/50 text-white shadow-inner">
        <HeartPulse size={29} />
      </div>

      <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
        A clearer way to manage hospital workflows.
      </h2>

      <p className="mx-auto mt-4 max-w-xl leading-7 text-teal-50">
        Explore the MediFlow experience as we build a connected platform for patients, doctors, and administrators.
      </p>

      <a
        href="#home"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-teal-800 px-6 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-teal-900 hover:shadow-lg motion-reduce:transform-none"
      >
        <span>Back to top</span>
        <ArrowRight size={17} aria-hidden="true" />
      </a>
    </div>
  </div>
</section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          
<a href="#home" className="flex items-center gap-2 font-bold text-slate-900">
  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
    <HeartPulse size={18} />
  </span>
  <span>
    Medi<span className="text-teal-600">Flow</span>
  </span>
</a>

          <p className="text-sm text-slate-500">A healthcare workflow project built for learning and demonstration.</p>
          <div className="text-sm md:text-right">
  <p className="font-semibold text-slate-800">
    Designed & developed by Gourab Taran
  </p>
  <a
    href="mailto:gourabtaran2005@gmail.com"
    className="mt-1 inline-block text-slate-500 transition-colors hover:text-teal-700"
  >
    gourabtaran2005@gmail.com
  </a>
  <p className="mt-2 text-xs text-slate-400">
    © {new Date().getFullYear()} MediFlow
  </p>
</div>
        </div>
      </footer>
    </div>
  )
}

export default App

